import { Shape } from '@antv/x6'
import { uid } from '../uid'

export class BooleanEdge extends Shape.Edge {
  static ShapeKey = 'BooleanEdge';
  value = true;

  constructor (properties) {
    super({
      id: uid(),
      shape: BooleanEdge.ShapeKey,
      defaultLabel: {
        markup: [
          {
            tagName: 'rect',
            selector: 'body'
          },
          {
            tagName: 'text',
            selector: 'label'
          }
        ],
        attrs: {
          label: {
            fill: '#000',
            fontSize: 14,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none'
          },
          body: {
            ref: 'label',
            fill: '#ffd591',
            stroke: '#ffa940',
            strokeWidth: 2,
            rx: 4,
            ry: 4,
            refWidth: '140%',
            refHeight: '140%',
            refX: '-20%',
            refY: '-20%'
          }
        },
        position: {
          distance: 0.5
        }
      },
      attrs: {
        line: {
          stroke: '#a0a0a0',
          strokeWidth: 1,
          targetMarker: {
            name: 'classic',
            size: 7
          }
        }
      },
      ...properties
    })

    if (properties) {
      this.changeValue(properties.value ?? true)
    } else {
      this.changeValue(true)
    }
  }

  changeValue (value) {
    this.value = value
    this.setLabels(this.value ? '是' : '否')
  }

  toJSON () {
    const newJson = {
      ...super.toJSON(),
      value: this.value
    }
    return newJson
  }
}
