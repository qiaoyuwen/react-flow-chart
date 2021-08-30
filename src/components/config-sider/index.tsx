import type { FunctionComponent } from 'react';
import styles from './index.less';

const ConfigSider: FunctionComponent = ({ children }) => {
  return (
    <div className={styles.sider}>
      <div className={styles.title}>配置栏</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ConfigSider;
