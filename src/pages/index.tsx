import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { useCallback } from 'react';
import type { Graph } from '@antv/x6';
import type { Addon } from '@antv/x6';
import { createDnd, createGraph, createStencil } from '@/graph';
import '@antv/x6-react-shape';
import ConfigSider from '@/components/config-sider';
import DefaltJson from './default.json';

export default function IndexPage() {
  const ref = useRef<HTMLDivElement>(null);
  const siderRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const dndRef = useRef<Addon.Dnd>();
  const stencilRef = useRef<Addon.Stencil>();

  const exportToJson = useCallback(async () => {
    console.log(
      'exportToJson',
      graphRef.current?.toJSON(),
      JSON.stringify(graphRef.current?.toJSON()),
    );
  }, []);

  const initGraph = useCallback(() => {
    if (
      !ref.current ||
      !siderRef.current ||
      (graphRef.current && dndRef.current && stencilRef.current)
    ) {
      return;
    }
    graphRef.current = createGraph(ref.current);
    graphRef.current.fromJSON(DefaltJson as any);
    dndRef.current = createDnd(graphRef.current);
    stencilRef.current = createStencil(graphRef.current);
    siderRef.current.appendChild(stencilRef.current.container);
  }, []);

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <Button onClick={exportToJson}>导出</Button>
      </div>
      <div className={styles.content}>
        <div className={styles.sider} ref={siderRef} />
        <div ref={ref} className={styles.canvas} />
        <ConfigSider />
      </div>
    </div>
  );
}
