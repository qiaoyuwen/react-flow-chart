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
import StartEventComponent from '@/graph/components/start-event';
import EndEventComponent from '@/graph/components/end-event';
import { getDataType } from '@/graph/components/utils';
import { NodeDataType } from '@/graph/components/enums';
import '@antv/x6-react-shape';
import ConditionTaskComponent from '@/graph/components/condition-task';
import CouponTaskComponent from '@/graph/components/coupon-task';
import { StartEventShape } from '@/graph/shapes/start-event';
import { EndEventShape } from '@/graph/shapes/end-event';
import { ConditionTaskShape } from '@/graph/shapes/condition-task';
import { CouponTaskShape } from '@/graph/shapes/coupon-task';

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
      let node;
      if (type === NodeDataType.StartEvent) {
        node = new StartEventShape();
      } else if (type === NodeDataType.EndEvent) {
        node = new EndEventShape();
      } else if (type === NodeDataType.ConditionTask) {
        node = new ConditionTaskShape();
      } else if (type === NodeDataType.CouponTask) {
        node = new CouponTaskShape();
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
          <div style={{ margin: 16 }}>
            <StartEventComponent startDrag={startDrag} />
          </div>
          <div style={{ margin: 16 }}>
            <ConditionTaskComponent startDrag={startDrag} />
          </div>
          <div style={{ margin: 16 }}>
            <CouponTaskComponent startDrag={startDrag} />
          </div>
          <div style={{ margin: 16 }}>
            <EndEventComponent startDrag={startDrag} />
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
