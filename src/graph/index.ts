/* eslint-disable no-param-reassign */
import { Addon, Graph, Shape } from '@antv/x6';
import { ConditionTaskShape } from './shapes/condition-task';
import { CouponTaskShape } from './shapes/coupon-task';
import { EndEventShape } from './shapes/end-event';
import { StartEventShape } from './shapes/start-event';

export const createGraph = (container: HTMLElement) => {
  const graph = new Graph({
    container,
    background: {
      color: '#fff', // 设置画布背景颜色
    },
    grid: {
      size: 10, // 网格大小 10px
      visible: true, // 渲染网格背景
    },
    snapline: true, // 对齐线
    selecting: {
      // 点选、框选
      enabled: true,
      rubberband: true,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: true,
    },
    highlighting: {
      // 高亮
      magnetAvailable: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#47C769',
          },
        },
      },
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6',
          },
        },
      },
    },
    connecting: {
      // 连线
      snap: {
        radius: 30,
      },
      allowBlank: false,
      allowMulti: false,
      allowLoop: false,
      highlight: true,
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      router: 'manhattan',
      anchor: 'center',
      connectionPoint: 'anchor',
      createEdge() {
        return new Shape.Edge({
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
        });
      },
    },
    scroller: {
      enabled: true,
      pannable: true,
      modifiers: ['alt'],
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
      minScale: 0.5,
      maxScale: 2,
    },
    keyboard: true,
    clipboard: true,
    history: true,
  });

  // 控制连接桩显示/隐藏
  graph.on('node:mouseenter', ({ view }) => {
    const portEls = view.container.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGElement>;
    portEls.forEach((el) => {
      el.style.visibility = 'visible';
    });
  });

  graph.on('node:mouseleave', ({ view }) => {
    const portEls = view.container.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGElement>;
    portEls.forEach((el) => {
      el.style.visibility = 'hidden';
    });
  });

  // 快捷键与事件
  // copy cut paste
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
    return false;
  });
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.cut(cells);
    }
    return false;
  });
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 });
      graph.cleanSelection();
      graph.select(cells);
    }
    return false;
  });

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.history.canUndo()) {
      graph.history.undo();
    }
    return false;
  });
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.history.canRedo()) {
      graph.history.redo();
    }
    return false;
  });

  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes();
    if (nodes) {
      graph.select(nodes);
    }
  });

  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  });

  return graph;
};

export const createDnd = (graph: Graph) => {
  return new Addon.Dnd({
    target: graph,
    animation: true,
  });
};

export const createStencil = (graph: Graph) => {
  const stencil = new Addon.Stencil({
    title: '组件栏',
    target: graph,
    stencilGraphWidth: 300,
    collapsable: false,
    layoutOptions: {
      columns: 2,
      columnWidth: 140,
      rowHeight: 120,
    },
  });

  stencil.load([
    new StartEventShape(),
    new ConditionTaskShape(),
    new CouponTaskShape(),
    new EndEventShape(),
  ]);

  return stencil;
};
