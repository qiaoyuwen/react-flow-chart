import type { FunctionComponent } from 'react';
import { NodeDataType } from '../enums';
import styles from './index.less';

interface EndEventComponentProps {
  startDrag?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const EndEventComponent: FunctionComponent<EndEventComponentProps> = ({ startDrag }) => {
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

export default EndEventComponent;
