import clsx from 'clsx';
import styles from './Badge.module.css';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
};

export function Badge({ children, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[variant], styles[size])}>
      {children}
    </span>
  );
}
