import type { Node } from '@antv/x6';
import { Shape } from '@antv/x6';
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports';
import { PortGroup, PortType } from '../ports/types';
import { BaseShape } from './base';

export class StartEventShape extends Shape.Circle implements BaseShape {
  static ShapeKey: string = 'StartEventShape';

  constructor(property?: Node.Properties) {
    super({
      width: 80,
      height: 80,
      shape: StartEventShape.ShapeKey,
      label: '开始',
      attrs: {
        root: {
          magnet: false,
        },
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        text: {
          fontSize: 16,
          color: '#262626',
        },
      },
      ports: {
        groups: {
          [PortGroup.Top]: TopPort,
          [PortGroup.Right]: RightPort,
          [PortGroup.Bottom]: BottomPort,
          [PortGroup.Left]: LeftPort,
        },
        items: [
          {
            type: PortType.InAndOut,
            group: PortGroup.Top,
          },
          {
            type: PortType.InAndOut,
            group: PortGroup.Right,
          },
          {
            type: PortType.InAndOut,
            group: PortGroup.Bottom,
          },
          {
            type: PortType.InAndOut,
            group: PortGroup.Left,
          },
        ],
      },
      ...property,
    });
  }
  canOutEdge() {
    const usedPorts = BaseShape.getUsedOutPorts(this);
    return usedPorts.length < 4;
  }

  canInEdge() {
    return false;
  }
}
