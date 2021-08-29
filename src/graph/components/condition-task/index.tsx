import type { FunctionComponent } from 'react';
import { NodeDataType } from '../enums';
import styles from './index.less';

interface ConditionTaskComponentProps {
  startDrag?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const ConditionTaskComponent: FunctionComponent<ConditionTaskComponentProps> =
  ({ startDrag }) => {
    return (
      <div className={styles.container}>
        <div
          data-type={NodeDataType.ConditionTask}
          className={styles.box}
          onMouseDown={startDrag}
        >
          <span className={styles.text}>判断框</span>
        </div>
      </div>
    );
  };

export default ConditionTaskComponent;
