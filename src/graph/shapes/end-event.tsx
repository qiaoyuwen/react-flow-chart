import type { Node } from '@antv/x6';
import { Shape } from '@antv/x6';
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports';
import { PortGroup, PortType } from '../ports/types';

export class EndEventShape extends Shape.Circle {
  static ShapeKey: string = 'EndEventShape';

  constructor(property?: Node.Properties) {
    super({
      width: 80,
      height: 80,
      label: '结束',
      shape: EndEventShape.ShapeKey,
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
}
