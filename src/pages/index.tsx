import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.less';
import { Button, Drawer } from 'antd';
import { useCallback } from 'react';
import { useState } from 'react';
import { Graph } from '@antv/x6';

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect', // 使用 rect 渲染
      x: 100,
      y: 200,
      width: 80,
      height: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'ellipse', // 使用 ellipse 渲染
      x: 300,
      y: 200,
      width: 80,
      height: 40,
      label: 'world',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    },
  ],
};

export default function IndexPage() {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const [visible, setVisible] = useState<boolean>(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const closeDrawer = () => {
    setVisible(false);
  };

  const exportXml = useCallback(async () => {}, []);

  useEffect(() => {
    if (!ref.current || graphRef.current) {
      return;
    }
    const graph = new Graph({
      container: ref.current,
      background: {
        color: '#fff', // 设置画布背景颜色
      },
      grid: {
        size: 10,      // 网格大小 10px
        visible: true, // 渲染网格背景
      },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      }, // 点选、框选
      snapline: true, // 对齐线
    });
    graph.fromJSON(data);
    graphRef.current = graph;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <Button onClick={exportXml}>导出</Button>
        <Button
          onClick={visible ? closeDrawer : showDrawer}
          style={{ marginLeft: 20 }}
        >
          {visible ? '关闭' : '打开'}
        </Button>
      </div>
      <div ref={ref} className={styles.canvas} />
      <Drawer
        title="配置栏"
        placement="right"
        closable={true}
        mask={false}
        onClose={closeDrawer}
        visible={visible}
        width={350}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
}
