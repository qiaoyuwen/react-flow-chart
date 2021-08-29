/* eslint-disable no-param-reassign */
import { Addon, Graph, Shape } from '@antv/x6';

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
        radius: 20,
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
        });
      },
    },
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

  return graph;
};

export const createDnd = (graph: Graph) => {
  return new Addon.Dnd({
    target: graph,
    animation: true,
  });
};
