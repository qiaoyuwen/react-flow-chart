import { NodeDataType } from '../components/enums';
import StartEventComponent from '../components/start-event';
import { getNodeSize } from '../components/utils';
import { BottomPort } from '../ports';
import { PortGroup, PortType } from '../ports/types';
import BaseShape from './base';

export class StartEventShape extends BaseShape {
  constructor() {
    super({
      ...getNodeSize(NodeDataType.StartEvent),
      ports: {
        groups: {
          [PortGroup.Bottom]: BottomPort,
        },
        items: [
          {
            type: PortType.Out,
            group: PortGroup.Bottom,
          },
        ],
      },
    });

    this.component = <StartEventComponent />;
  }
}
