import type { FunctionComponent } from 'react';
import { NodeDataType } from '../enums';
import styles from './index.less';

interface StartEventNodeProps {
  startDrag?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const StartEventNode: FunctionComponent<StartEventNodeProps> = ({
  startDrag,
}) => {
  return (
    <div data-type={NodeDataType.StartEvent} className={styles.circle} onMouseDown={startDrag}>
      开始
    </div>
  );
};

export default StartEventNode;
