import { Shape } from '@antv/x6';

export class BooleanEdge extends Shape.Edge {
  static ShapeKey = 'BooleanEdge';
  value: boolean = true;

  constructor(properties?: any & { value?: boolean }) {
    super({
      shape: BooleanEdge.ShapeKey,
      defaultLabel: {
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          label: {
            fill: '#000',
            fontSize: 14,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
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
            refY: '-20%',
          },
        },
        position: {
          distance: 0.5,
        },
      },
      attrs: {
        line: {
          stroke: '#a0a0a0',
          strokeWidth: 1,
          targetMarker: {
            name: 'classic',
            size: 7,
          },
        },
      },
      zIndex: 0,
      ...properties,
    });

    this.changeValue(properties?.value ?? true);
  }

  changeValue(value: boolean) {
    this.value = value;
    this.setLabels(this.value ? '是' : '否');
  }
}
