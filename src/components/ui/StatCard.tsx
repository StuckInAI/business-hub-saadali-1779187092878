import styles from './StatCard.module.css';

export type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
};

export function StatCard({ title, value, icon, color = 'primary' }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}
