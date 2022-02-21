import { Shape } from '@antv/x6'
import { uid } from '../uid'

export class MessageEventGroupShape extends Shape.Rect {
  static ShapeKey = 'MessageEventGroupShape';
  values = {};

  constructor (property) {
    super({
      id: uid(),
      width: 280,
      height: 280,
      shape: MessageEventGroupShape.ShapeKey,
      attrs: {
        body: {
          fill: '#fffbe6'
        }
      },
      zIndex: 0,
      ...property
    })
    this.values = property && property.values ? property.values : {}
  }

  canOutEdge () {
    return false
  }

  canInEdge () {
    return false
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
