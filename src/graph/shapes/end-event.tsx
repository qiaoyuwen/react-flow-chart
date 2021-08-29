import EndEventComponent from '../components/end-event';
import { NodeDataType } from '../components/enums';
import { getNodeSize } from '../components/utils';
import { TopPort } from '../ports';
import { PortGroup, PortType } from '../ports/types';
import BaseShape from './base';

export class EndEventShape extends BaseShape {
  constructor() {
    super({
      ...getNodeSize(NodeDataType.EndEvent),
      ports: {
        groups: {
          [PortGroup.Top]: TopPort,
        },
        items: [
          {
            type: PortType.In,
            group: PortGroup.Top,
          },
        ],
      },
    });

    this.component = <EndEventComponent />;
  }
}
