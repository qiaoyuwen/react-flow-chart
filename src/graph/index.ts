import { Addon, Graph } from '@antv/x6';

export const createGraph = (container: HTMLElement) => {
  return new Graph({
    container,
    background: {
      color: '#fff', // 设置画布背景颜色
    },
    grid: {
      size: 10, // 网格大小 10px
      visible: true, // 渲染网格背景
    },
    selecting: {
      enabled: true,
      showNodeSelectionBox: true,
    }, // 点选、框选
    snapline: true, // 对齐线
  });
};

export const createDnd = (graph: Graph) => {
  return new Addon.Dnd({
    target: graph,
    animation: true,
  });
};
