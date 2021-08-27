import type { FunctionComponent } from 'react';
import { NodeDataType } from '../enums';
import styles from './index.less';

interface ConditionTaskNodeProps {
  startDrag?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const ConditionTaskNode: FunctionComponent<ConditionTaskNodeProps> = ({
  startDrag,
}) => {
  return (
    <div
      data-type={NodeDataType.ConditionTask}
      className={styles.box}
      onMouseDown={startDrag}
    >
      <span className={styles.text}>判断框</span>
    </div>
  );
};

export default ConditionTaskNode;
