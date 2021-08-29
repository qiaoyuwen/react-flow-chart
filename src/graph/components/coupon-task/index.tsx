import type { FunctionComponent } from 'react';
import { NodeDataType } from '../enums';
import styles from './index.less';

interface CouponTaskComponentProps {
  startDrag?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CouponTaskComponent: FunctionComponent<CouponTaskComponentProps> = ({
  startDrag,
}) => {
  return (
    <div
      data-type={NodeDataType.CouponTask}
      className={styles.box}
      onMouseDown={startDrag}
    >
      推送优惠券
    </div>
  );
};

export default CouponTaskComponent;
