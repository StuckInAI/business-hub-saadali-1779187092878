import { useCurrentUser } from '@/hooks/useStorage';

export function SettingsPage() {
  const { currentUser, users, switchUser } = useCurrentUser();

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--spacing-6)' }}>Settings</h1>

      <section style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Current User</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--font-size-base)' }}>
            {currentUser.avatar}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>{currentUser.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{currentUser.email}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', textTransform: 'capitalize' }}>{currentUser.role}</p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Switch User (Demo)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)' }}>
          This is a demo app. Switch between user roles to see different permission levels.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => switchUser(u)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-3) var(--spacing-4)',
                background: currentUser.id === u.id ? 'var(--color-primary-light)' : 'var(--bg-base)',
                border: currentUser.id === u.id ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--font-size-xs)', flexShrink: 0 }}>
                {u.avatar}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{u.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', textTransform: 'capitalize' }}>{u.role}</p>
              </div>
              {currentUser.id === u.id && (
                <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>Active</span>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
