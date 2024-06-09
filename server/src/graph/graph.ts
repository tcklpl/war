import { Node } from './node';

export class Graph<T> {
    nodes: Map<T, Node<T>> = new Map();

    addNode(n: T) {
        let node = this.nodes.get(n);
        if (node) return node;

        node = new Node(n);
        this.nodes.set(n, node);
        return node;
    }
}
