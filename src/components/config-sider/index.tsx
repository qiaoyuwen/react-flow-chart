import type { Cell } from '@antv/x6';
import type { FunctionComponent } from 'react';
import styles from './index.less';
import { BooleanEdge } from '@/graph/edges/boolean-edge';
import BooleanEdgeForm from '../boolean-edge-form';
import { ConditionTaskShape } from '@/graph/shapes/condition-task';
import ConditionTaskForm from '../condition-task-form';

interface ConfigSiderProps {
  cell?: Cell;
}

const ConfigSider: FunctionComponent<ConfigSiderProps> = ({ cell }) => {
  return (
    <div className={styles.sider}>
      <div className={styles.title}>配置栏</div>
      {cell && (
        <div className={styles.content}>
          {cell instanceof BooleanEdge && <BooleanEdgeForm edge={cell} />}
          {cell instanceof ConditionTaskShape && (
            <ConditionTaskForm node={cell} />
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigSider;
