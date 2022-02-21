import { Node, ObjectExt } from '@antv/x6'
import { BottomPort, LeftPort, RightPort, TopPort } from '../ports'
import { PortGroup, PortType } from '../ports/types'
import { uid } from '../uid'
import { BaseShape } from './base'

export class MessageEventShape extends Node {
  static ShapeKey = 'MessageEventShape';
  values = {};

  constructor (property) {
    super({
      id: uid(),
      width: 80,
      height: 80,
      shape: MessageEventShape.ShapeKey,
      label: '触发器',
      markup: [
        {
          tagName: 'ellipse',
          selector: 'outer'
        },
        {
          tagName: 'ellipse',
          selector: 'inner'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ],
      attrs: {
        root: {
          magnet: false
        },
        outer: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          rx: 40,
          ry: 40,
          refX: '50%',
          refY: '50%'
        },
        inner: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          rx: 30,
          ry: 30,
          refX: '50%',
          refY: '50%'
        },
        text: {
          fontSize: 16,
          color: '#262626',
          refX: '50%',
          refY: '50%',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle'
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
    return usedPorts.length < 1
  }

  canInEdge () {
    const usedPorts = BaseShape.getUsedInPorts(this)
    return usedPorts.length < 1
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

MessageEventShape.config({
  // 通过钩子将自定义选项 label 应用到 'attrs/text/text' 属性上
  propHooks (metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  }
})
