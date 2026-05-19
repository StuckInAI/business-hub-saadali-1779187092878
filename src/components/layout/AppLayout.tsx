import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useCurrentUser } from '@/hooks/useStorage';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const { currentUser, users, switchUser } = useCurrentUser();

  return (
    <div className={styles.layout}>
      <Sidebar role={currentUser.role} />
      <div className={styles.main}>
        <Header currentUser={currentUser} users={users} switchUser={switchUser} />
        <main className={styles.content}>
          <Outlet context={{ currentUser }} />
        </main>
      </div>
    </div>
  );
}
