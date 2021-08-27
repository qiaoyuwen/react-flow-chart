import type { FunctionComponent } from 'react';
import styles from './index.less';

const Sider: FunctionComponent = ({ children }) => {
  return (
    <div className={styles.sider}>
      <div className={styles.title}>组件栏</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Sider;
