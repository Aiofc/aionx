import styles from './aionx-ui.module.css';

/* eslint-disable-next-line */
export interface AionxUiProps {}

export function AionxUi(props: AionxUiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to AionxUi!</h1>
    </div>
  );
}

export default AionxUi;
