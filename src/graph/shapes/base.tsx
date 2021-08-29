import type { Edge, Graph } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
import type { PortManager } from '@antv/x6/lib/model/port';
import { PortType } from '../ports/types';

class BaseShape extends ReactShape {
  constructor({
    width,
    height,
    ports,
  }: {
    width?: number;
    height?: number;
    ports?: Partial<PortManager.Metadata> | PortManager.PortMetadata[];
  }) {
    super({
      width,
      height,
      shape: 'react-shape',
      ports,
    });
  }

  getInPorts() {
    return this.getPortsByGroup(PortType.In).concat(
      this.getPortsByGroup(PortType.InAndOut),
    );
  }

  getOutPorts() {
    return this.getPortsByGroup(PortType.Out).concat(
      this.getPortsByGroup(PortType.InAndOut),
    );
  }

  getUsedInPorts(graph: Graph) {
    const incomingEdges = graph.getIncomingEdges(this) || [];
    return incomingEdges.map((edge: Edge) => {
      const portId = edge.getTargetPortId();
      return this.getPort(portId!);
    });
  }
}

export default BaseShape;
