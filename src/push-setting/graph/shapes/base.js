export class BaseShape {
  static getUsedInPorts (node) {
    const graph = node.model.graph
    if (!graph) {
      return []
    }
    const incomingEdges = graph.getIncomingEdges(node) || []
    const ports = []
    incomingEdges.forEach((edge) => {
      const portId = edge.getTargetPortId()
      if (!portId) {
        return
      }
      const port = node.getPort(portId)
      if (port) {
        ports.push(port)
      }
    })
    return ports
  }

  static getUsedOutPorts (node) {
    const graph = node.model.graph
    if (!graph) {
      return []
    }
    const outgoingEdges = graph.getOutgoingEdges(node) || []
    const ports = []
    outgoingEdges.forEach((edge) => {
      const portId = edge.getSourcePortId()
      if (!portId) {
        return
      }
      const port = node.getPort(portId)
      if (port) {
        ports.push(port)
      }
    })
    return ports
  }
}
