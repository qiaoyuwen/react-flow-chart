import type { Edge, Node } from '@antv/x6';
import { PortManager } from '@antv/x6/lib/model/port';

export abstract class BaseShape {
  abstract canOutEdge?: () => boolean;
  abstract canInEdge?: () => boolean;

  static getUsedInPorts(node: Node) {
    const graph = node.model?.graph;
    if (!graph) {
      return [];
    }
    const incomingEdges = graph.getIncomingEdges(node) || [];
    const ports: PortManager.PortMetadata[] = [];
    incomingEdges.forEach((edge: Edge) => {
      const portId = edge.getTargetPortId();
      if (!portId) {
        return;
      }
      const port = node.getPort(portId);
      if (port) {
        ports.push(port);
      }
    });
    return ports;
  }

  static getUsedOutPorts(node: Node) {
    const graph = node.model?.graph;
    if (!graph) {
      return [];
    }
    const outgoingEdges = graph.getOutgoingEdges(node) || [];
    const ports: PortManager.PortMetadata[] = [];
    outgoingEdges.forEach((edge: Edge) => {
      const portId = edge.getSourcePortId();
      if (!portId) {
        return;
      }
      const port = node.getPort(portId);
      if (port) {
        ports.push(port);
      }
    });
    return ports;
  }
}
