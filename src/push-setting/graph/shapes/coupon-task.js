import { Shape } from '@antv/x6'
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports'
import { PortGroup, PortType } from '../ports/types'
import { BaseShape } from './base'
import { uid } from '../uid'

export class CouponTaskShape extends Shape.Rect {
  static ShapeKey = 'CouponTaskShape';
  values = {};

  constructor (property) {
    super({
      id: uid(),
      width: 120,
      height: 80,
      label: '任务框',
      shape: CouponTaskShape.ShapeKey,
      attrs: {
        root: {
          magnet: false
        },
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          rx: 5,
          ry: 5
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
            type: PortType.InAndOut,
            group: PortGroup.Top
          },
          {
            type: PortType.InAndOut,
            group: PortGroup.Right
          },
          {
            type: PortType.InAndOut,
            group: PortGroup.Bottom
          },
          {
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
    return usedPorts.length === 0
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
