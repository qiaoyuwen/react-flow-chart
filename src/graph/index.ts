/* eslint-disable no-param-reassign */
import type { Node } from '@antv/x6';
import { Addon, Graph, Shape } from '@antv/x6';
import { BooleanEdge } from './edges/boolean-edge';
import { BaseShape } from './shapes/base';
import { ConditionTaskShape } from './shapes/condition-task';
import { CouponTaskShape } from './shapes/coupon-task';
import { EndEventShape } from './shapes/end-event';
import { StartEventShape } from './shapes/start-event';

// 注册节点
Graph.registerNode(StartEventShape.ShapeKey, StartEventShape);
Graph.registerNode(EndEventShape.ShapeKey, EndEventShape);
Graph.registerNode(ConditionTaskShape.ShapeKey, ConditionTaskShape);
Graph.registerNode(CouponTaskShape.ShapeKey, CouponTaskShape);

// 注册边
Graph.registerEdge(BooleanEdge.ShapeKey, BooleanEdge);

export const createGraph = (container: HTMLElement) => {
  const graph: Graph = new Graph({
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
      createEdge({ sourceCell }) {
        if (sourceCell instanceof ConditionTaskShape) {
          const edge = (graph.getOutgoingEdges(sourceCell) || [])[0];
          if (edge instanceof BooleanEdge) {
            return new BooleanEdge({
              value: !edge.value,
            });
          }
          return new BooleanEdge();
        }
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
        });
      },
      validateConnection({ targetView, targetMagnet }) {
        if (!targetMagnet) {
          return false;
        }

        if (targetView) {
          const node = targetView.cell as BaseShape & Node;
          if (!node.canInEdge) {
            return false;
          }
          const canInEdge = node.canInEdge();
          if (!canInEdge) {
            return false;
          }

          const usedPortIds: string[] = [];
          [
            ...BaseShape.getUsedInPorts(node),
            ...BaseShape.getUsedOutPorts(node),
          ].forEach((item) => {
            if (item.id) {
              usedPortIds.push(item.id);
            }
          });
          const portId = targetMagnet.getAttribute('port');
          if (!portId) {
            return false;
          }
          if (usedPortIds.includes(portId)) {
            return false;
          }
        }

        return true;
      },
    },
    scroller: {
      enabled: true,
      pannable: true,
      modifiers: ['alt'],
    },
    mousewheel: {
      enabled: true,
      modifiers: ['alt'],
      minScale: 0.5,
      maxScale: 2,
    },
    keyboard: true,
    clipboard: true,
    history: true,
  });

  const showOrHidePorts = (ports: SVGElement[], show: boolean = true) => {
    ports.forEach((el) => {
      el.style.visibility = show ? 'visible' : 'hidden';
    });
  };

  // 控制连接桩显示/隐藏
  graph.on('node:mouseenter', ({ node, view }) => {
    const shape = node as unknown as Node & BaseShape;
    if (shape.canOutEdge) {
      const canOutEdge = shape.canOutEdge();
      if (canOutEdge) {
        const usedPortIds: string[] = [];
        [
          ...BaseShape.getUsedInPorts(shape),
          ...BaseShape.getUsedOutPorts(shape),
        ].forEach((item) => {
          if (item.id) {
            usedPortIds.push(item.id);
          }
        });

        const portEls = Array.from(
          view.container.querySelectorAll(
            '.x6-port-body',
          ) as NodeListOf<SVGElement>,
        ).filter((portEl) => {
          const id = portEl.getAttribute('port');
          if (!id) {
            return false;
          }
          return !usedPortIds.includes(id);
        });
        showOrHidePorts(portEls, true);
      }
    } else {
      throw Error(`${node.shape} does not implements BaseShape`);
    }
  });

  graph.on('node:mouseleave', ({ view }) => {
    const portEls = Array.from(
      view.container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>,
    );
    showOrHidePorts(portEls, false);
  });

  graph.on('node:click', ({ view }) => {
    const portEls = Array.from(
      view.container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>,
    );
    showOrHidePorts(portEls, false);
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
