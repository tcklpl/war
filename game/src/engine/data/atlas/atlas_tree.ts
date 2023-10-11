import { BadTreeError } from "../../../errors/engine/data/bad_tree";
import { Vec2 } from "../vec/vec2";

/**
 * The atlas will be divided into a tree to make it easy to allocate regions.
 * This is not necessarily the best way to accomplish this, as this will not account for a lot of
 * possible placement variations, but it will be more than enough for our use case.
 * 
 * We'll use a tree with a depth of 4 (including the trunk) and each node will have 4 children.
 * Thus being: the fist 4 children BIG mapped regions, their children MEDIUM and the MEDIUM's children SMALL.
 * 
 * Depth 0: (trunk): tree base;
 * Depth 1: holds 4 BIG mapped regions;
 * Depth 2: holds 16 MEDIUM mapped regions;
 * Depth 3: (leaves): holds 64 SMALL mapped regions.
 */
export class AtlasTree {

    private _trunk: AtlasTreeNode;

    constructor() {
        this._trunk = this.buildTree() as AtlasTreeNode;
    }

    /**
     * Builds the Atlas Tree recursively. The first call should be with no parameters.
     * 
     * @param position Current position, measured in units where 1u = 1 SMALL mapped region.
     * @param depth Current tree depth.
     * @returns The tree.
     */
    private buildTree(position: Vec2 = Vec2.fromValue(0), depth: number = 0): AtlasTreeNode | undefined {
        // return undefined as nodes with a depth of 2 are going to be leaves
        if (depth > 3) return undefined;

        /*
            Child side size, as we're in a 8x8 grid:
            Depth 1 should have a size of 4;
            Depth 2 should have a size of 2;
            Depth 3 should have a size of 1.

            This relation can be defined as the equation 4 / 2^depth.
        */
        const childSize = 4 / (2**(depth));
        /*  
            Children distribution:
            +---+---+
            | 0 | 1 |
            +---+---+
            | 2 | 3 |
            +---+---+
        */
        const child0 = this.buildTree(position.add(new Vec2(0 * childSize, 0 * childSize)), depth + 1);
        const child1 = this.buildTree(position.add(new Vec2(1 * childSize, 0 * childSize)), depth + 1);
        const child2 = this.buildTree(position.add(new Vec2(0 * childSize, 1 * childSize)), depth + 1);
        const child3 = this.buildTree(position.add(new Vec2(1 * childSize, 1 * childSize)), depth + 1);

        // we only need to check 1 child because they are going to be undefined based on depth
        const isLeaf = child0 === undefined;
        const children = isLeaf ? [] : [child0, child1, child2, child3] as AtlasTreeNode[];
        const node = new AtlasTreeNode(position.xy, depth, children);
        return node;
    }

    /**
     * Tries to find one available node on the desired depth. The first call should only specify the desired depth.
     * 
     * @param desiredDepth Desired node depth, being 1, 2 or 3.
     * @param node Current node being searched, should be omitted in the first call.
     * @returns A node or null if one isn't available.
     */
    tryToFindAvailableNode(desiredDepth: number, node: AtlasTreeNode = this._trunk): AtlasTreeNode | null {
        // return if available if this is the desired depth
        if (node.depth === desiredDepth && node.available) return node;
        // check children if it isn't still deep enough. Ignore children if the node itself isn't available
        if (node.depth < desiredDepth && node.children.length === 4 && node.available) {
            for (const child of node.children) {
                const childSearch = this.tryToFindAvailableNode(desiredDepth, child);
                if (childSearch) return childSearch;
            }
        }
        return null;
    }
}

/**
 * Node of an Atlas Tree.
 * 
 * Each node can have 0 or 4 children, depending on depth.
 */
export class AtlasTreeNode {

    private _children: AtlasTreeNode[];
    private _available = true;

    constructor(private _position: Vec2, private _depth: number, children: AtlasTreeNode[]) {
        if (children.length !== 4 && children.length !== 0) {
            throw new BadTreeError(`Trying to create atlas tree node with ${children.length} children (should be 0 or 4)`);
        }

        this._children = children ?? [];
    }

    get position() {
        return this._position;
    }

    get depth() {
        return this._depth;
    }

    get isLeaf() {
        return this._children.length === 0;
    }

    get children() {
        return this._children;
    }

    /**
     * Returns if this node and all it's children are available.
     * Checking the children is necessary in case a child is already in use and this node was also selected
     * because it was "available", overwriting the child's data in the final map.
     */
    get available(): boolean {
        return this._children.reduce((available, child) => available && child.available, this._available);
    }

    /**
     * Sets this node's availability and updates all children.
     */
    set available(a: boolean) {
        this._available = a;
        this._children.forEach(child => child.available = a);
    }


}