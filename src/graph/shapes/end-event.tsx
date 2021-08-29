import EndEventComponent from '../components/end-event';
import { NodeDataType } from '../components/enums';
import { getNodeSize } from '../components/utils';
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports';
import { PortGroup, PortType } from '../ports/types';
import BaseShape from './base';

export class EndEventShape extends BaseShape {
  constructor() {
    super({
      ...getNodeSize(NodeDataType.EndEvent),
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
    });

    this.component = <EndEventComponent />;
  }
}
