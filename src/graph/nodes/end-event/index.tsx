import type { FunctionComponent } from 'react';
import { NodeDataType } from '../enums';
import styles from './index.less';

interface EndEventNodeProps {
  startDrag?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const EndEventNode: FunctionComponent<EndEventNodeProps> = ({ startDrag }) => {
  return (
    <div
      data-type={NodeDataType.EndEvent}
      className={styles.circle}
      onMouseDown={startDrag}
    >
      结束
    </div>
  );
};

export default EndEventNode;
