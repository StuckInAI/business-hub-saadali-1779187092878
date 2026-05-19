import styles from './StatCard.module.css';

export type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void | Promise<void>;
};

export function StatCard({ title, value, icon, color = 'primary', onClick }: StatCardProps) {
  return (
    <div
      className={`${styles.card} ${styles[color]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}
