import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { HRUser } from '@/types';
import styles from './Header.module.css';

type HeaderProps = {
  currentUser: HRUser;
  users: HRUser[];
  switchUser: (user: HRUser) => void;
};

export function Header({ currentUser, users, switchUser }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const roleColor: Record<string, string> = {
    admin: 'var(--color-primary)',
    recruiter: 'var(--color-secondary)',
    viewer: 'var(--color-warning)',
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h2 className={styles.pageTitle}>HR Management Portal</h2>
      </div>
      <div className={styles.right}>
        <div className={styles.userMenu}>
          <button className={styles.userBtn} onClick={() => setOpen(o => !o)}>
            <div className={styles.avatar}>{currentUser.avatar}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser.name}</span>
              <span className={styles.userRole} style={{ color: roleColor[currentUser.role] }}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </button>
          {open && (
            <div className={styles.dropdown}>
              <p className={styles.dropdownLabel}>Switch User (Demo)</p>
              {users.map(u => (
                <button
                  key={u.id}
                  className={styles.dropdownItem}
                  onClick={() => { switchUser(u); setOpen(false); }}
                >
                  <div className={styles.avatarSm}>{u.avatar}</div>
                  <div className={styles.dropdownUserInfo}>
                    <span>{u.name}</span>
                    <span className={styles.dropdownRole}>{u.role}</span>
                  </div>
                  {currentUser.id === u.id && <Check size={14} color="var(--color-primary)" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
