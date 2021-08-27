import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.less';
import { Button, Drawer } from 'antd';
import { useCallback } from 'react';
import { useState } from 'react';
import type { Graph } from '@antv/x6';
import type { Addon } from '@antv/x6';
import { createDnd, createGraph } from '@/graph';
import Sider from '@/components/sider';
import StartEventNode from '@/graph/nodes/start-event';
import EndEventNode from '@/graph/nodes/end-event';
import { getDataType, getNodeSize } from '@/graph/nodes/utils';
import { NodeDataType } from '@/graph/nodes/enums';
import '@antv/x6-react-shape';
import ConditionTaskNode from '@/graph/nodes/condition-task';
import CouponTaskNode from '@/graph/nodes/coupon-task';

export default function IndexPage() {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const dndRef = useRef<Addon.Dnd>();
  const [visible, setVisible] = useState<boolean>(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const closeDrawer = () => {
    setVisible(false);
  };

  const exportXml = useCallback(async () => {}, []);

  const startDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!graphRef.current) {
        return;
      }
      const type = getDataType(e.currentTarget);
      const size = getNodeSize(type);
      let node;
      if (type === NodeDataType.StartEvent) {
        node = graphRef.current.createNode({
          ...size,
          shape: 'react-shape',
          component: <StartEventNode />,
        });
      } else if (type === NodeDataType.EndEvent) {
        node = graphRef.current.createNode({
          ...size,
          shape: 'react-shape',
          component: <EndEventNode />,
        });
      } else if (type === NodeDataType.ConditionTask) {
        node = graphRef.current.createNode({
          ...size,
          shape: 'react-shape',
          component: <ConditionTaskNode />,
        });
      } else if (type === NodeDataType.CouponTask) {
        node = graphRef.current.createNode({
          ...size,
          shape: 'react-shape',
          component: <CouponTaskNode />,
        });
      }

      if (node) {
        dndRef.current?.start(node, e.nativeEvent as any);
      }
    },
    [],
  );

  const initGraph = () => {
    if (!ref.current || (graphRef.current && dndRef.current)) {
      return;
    }
    graphRef.current = createGraph(ref.current);
    dndRef.current = createDnd(graphRef.current);
  };

  useEffect(() => {
    initGraph();
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
      <div className={styles.content}>
        <Sider>
          <div style={{margin: 16}}>
            <StartEventNode startDrag={startDrag} />
          </div>
          <div style={{margin: 16}}>
            <ConditionTaskNode startDrag={startDrag} />
          </div>
          <div style={{margin: 16}}>
            <CouponTaskNode startDrag={startDrag} />
          </div>
          <div style={{margin: 16}}>
            <EndEventNode startDrag={startDrag} />
          </div>
        </Sider>
        <div ref={ref} className={styles.canvas} />
      </div>
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
