import type { Edge, Node } from '@antv/x6';

export abstract class BaseShape {
  abstract canOutEdge?: () => boolean;
  abstract canInEdge?: () => boolean;

  static getUsedInPorts(node: Node) {
    const graph = node.model?.graph;
    if (!graph) {
      return [];
    }
    const incomingEdges = graph.getIncomingEdges(node) || [];
    return incomingEdges.map((edge: Edge) => {
      const portId = edge.getTargetPortId();
      return node.getPort(portId!);
    });
  }

  static getUsedOutPorts(node: Node) {
    const graph = node.model?.graph;
    if (!graph) {
      return [];
    }
    const outgoingEdges = graph.getOutgoingEdges(node) || [];
    return outgoingEdges.map((edge: Edge) => {
      const portId = edge.getSourcePortId();
      return node.getPort(portId!);
    });
  }
}
