import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useStorage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function SettingsPage() {
  const { currentUser, users } = useCurrentUser();
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const roleVariant: Record<string, 'primary' | 'success' | 'warning'> = {
    admin: 'primary',
    recruiter: 'success',
    viewer: 'warning',
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Settings</h1>

      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Current User</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
            {currentUser.avatar}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{currentUser.email}</p>
          </div>
          <Badge variant={roleVariant[currentUser.role] ?? 'neutral'}>{currentUser.role}</Badge>
        </div>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Switch users via the top-right dropdown to simulate different permission levels.</p>
      </section>

      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Team Members</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {users.map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                {u.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>{u.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>{u.email}</p>
              </div>
              <Badge variant={roleVariant[u.role] ?? 'neutral'}>{u.role}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Preferences</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Company Name</label>
            <input
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: 'var(--font-size-sm)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }}
              defaultValue="TalentFlow Inc."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            {saved && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)' }}>Saved!</span>}
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
