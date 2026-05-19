import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Columns, Settings, Globe } from 'lucide-react';
import { UserRole } from '@/types';
import styles from './Sidebar.module.css';

type SidebarProps = {
  role: UserRole;
};

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['admin', 'recruiter', 'viewer'] },
  { to: '/job-listings', label: 'Job Listings', icon: <Briefcase size={18} />, roles: ['admin', 'recruiter', 'viewer'] },
  { to: '/applications', label: 'Applications', icon: <Users size={18} />, roles: ['admin', 'recruiter', 'viewer'] },
  { to: '/kanban', label: 'Pipeline Board', icon: <Columns size={18} />, roles: ['admin', 'recruiter', 'viewer'] },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} />, roles: ['admin', 'recruiter'] },
];

export function Sidebar({ role }: SidebarProps) {
  const filtered = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Briefcase size={20} color="white" />
        </div>
        <span className={styles.brandName}>TalentFlow</span>
      </div>

      <nav className={styles.nav}>
        {filtered.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <a href="/jobs" target="_blank" rel="noopener noreferrer" className={styles.publicLink}>
          <Globe size={16} />
          <span>View Public Board</span>
        </a>
      </div>
    </aside>
  );
}
