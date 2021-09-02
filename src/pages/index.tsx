import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { useCallback } from 'react';
import type { Cell, Graph } from '@antv/x6';
import type { Addon } from '@antv/x6';
import { createDnd, createGraph, createStencil } from '@/graph';
import '@antv/x6-react-shape';
import ConfigSider from '@/components/config-sider';
import DefaltJson from './default.json';
import { useState } from 'react';

export default function IndexPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const siderRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const dndRef = useRef<Addon.Dnd>();
  const stencilRef = useRef<Addon.Stencil>();
  const [selectedCell, setSelectedCell] = useState<Cell>();

  const exportToJson = useCallback(async () => {
    if (!graphRef.current) {
      return;
    }
    console.log(
      'exportToJson',
      graphRef.current?.toJSON(),
      JSON.stringify(graphRef.current?.toJSON()),
    );
  }, []);

  const initGraph = useCallback(() => {
    if (
      !canvasRef.current ||
      !siderRef.current ||
      (graphRef.current && dndRef.current && stencilRef.current)
    ) {
      return;
    }
    graphRef.current = createGraph(canvasRef.current);
    graphRef.current.fromJSON(DefaltJson as any);
    graphRef.current.on('node:selected', ({ node }) => {
      setSelectedCell(node);
    });
    graphRef.current.on('edge:selected', ({ edge }) => {
      setSelectedCell(edge);
    });
    graphRef.current.on('blank:click', () => {
      setSelectedCell(undefined);
    });
    graphRef.current.on('node:removed', () => {
      setSelectedCell(undefined);
    });
    graphRef.current.on('edge:removed', () => {
      setSelectedCell(undefined);
    });

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
        <div ref={canvasRef} className={styles.canvas} />
        <ConfigSider cell={selectedCell} />
      </div>
    </div>
  );
}
