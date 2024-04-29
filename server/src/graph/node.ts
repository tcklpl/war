export class Node<T> {
    landAdjacentNodes: Set<Node<T>> = new Set();
    seaAdjacentNodes: Set<Node<T>> = new Set();

    constructor(public data: T) {}

    addAdjacentNode(type: 'land' | 'sea', ...adjacentNodes: Node<T>[]) {
        adjacentNodes.forEach(node => (type === 'land' ? this.landAdjacentNodes : this.seaAdjacentNodes).add(node));
    }

    get adjacentNodes() {
        return [...Array.from(this.landAdjacentNodes), ...Array.from(this.seaAdjacentNodes)];
    }
}
