import type {
  CompareType,
  ConditionValueType,
} from '@/components/condition-task-form/constant';
import type { Node } from '@antv/x6';
import { Shape } from '@antv/x6';
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports';
import { PortGroup, PortType } from '../ports/types';
import { BaseShape } from './base';

export interface ConditionTaskShapeFormData {
  valueType?: ConditionValueType;
  value?: number;
  compareType?: CompareType;
}
export class ConditionTaskShape extends Shape.Polygon implements BaseShape {
  static ShapeKey: string = 'ConditionTaskShape';
  values: ConditionTaskShapeFormData = {};

  constructor(
    property?: Node.Properties & { values?: ConditionTaskShapeFormData },
  ) {
    super({
      width: 100,
      height: 100,
      label: '判断框',
      shape: ConditionTaskShape.ShapeKey,
      attrs: {
        root: {
          magnet: false,
        },
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
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
    this.values = property?.values || {};
  }

  canOutEdge() {
    const usedPorts = BaseShape.getUsedOutPorts(this);
    return usedPorts.length < 2;
  }

  canInEdge() {
    const usedPorts = BaseShape.getUsedInPorts(this);
    return usedPorts.length === 0;
  }

  changeValues(values: ConditionTaskShapeFormData) {
    this.values = values;
  }
}
