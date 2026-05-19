import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
};

export function StatCard({ label, value, icon, color = 'var(--color-primary)', subtitle }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ background: color + '20', color }}>
        {icon}
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}
