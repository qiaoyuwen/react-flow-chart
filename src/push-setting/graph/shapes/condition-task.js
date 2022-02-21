
import { Shape } from '@antv/x6'
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports'
import { PortGroup, PortType } from '../ports/types'
import { BaseShape } from './base'
import { uid } from '../uid'

export class ConditionTaskShape extends Shape.Polygon {
  static ShapeKey = 'ConditionTaskShape';
  values = {};

  constructor (
    property
  ) {
    super({
      id: uid(),
      width: 100,
      height: 100,
      label: '判断框',
      shape: ConditionTaskShape.ShapeKey,
      attrs: {
        root: {
          magnet: false
        },
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF'
        },
        text: {
          fontSize: 16,
          color: '#262626'
        }
      },
      ports: {
        groups: {
          [PortGroup.Top]: TopPort,
          [PortGroup.Right]: RightPort,
          [PortGroup.Bottom]: BottomPort,
          [PortGroup.Left]: LeftPort
        },
        items: [
          {
            id: PortGroup.Top,
            type: PortType.InAndOut,
            group: PortGroup.Top
          },
          {
            id: PortGroup.Right,
            type: PortType.InAndOut,
            group: PortGroup.Right
          },
          {
            id: PortGroup.Bottom,
            type: PortType.InAndOut,
            group: PortGroup.Bottom
          },
          {
            id: PortGroup.Left,
            type: PortType.InAndOut,
            group: PortGroup.Left
          }
        ]
      },
      ...property
    })
    this.values = property && property.values ? property.values : {}
  }

  canOutEdge () {
    const usedPorts = BaseShape.getUsedOutPorts(this)
    return usedPorts.length < 2
  }

  canInEdge () {
    const usedPorts = BaseShape.getUsedInPorts(this)
    return usedPorts.length === 0
  }

  changeValues (values) {
    this.values = values
  }

  toJSON () {
    const newJson = {
      ...super.toJSON(),
      values: this.values
    }
    return newJson
  }
}
