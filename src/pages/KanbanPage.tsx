import { useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const COLUMNS: ApplicationStatus[] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const COLUMN_VARIANTS: Record<ApplicationStatus, 'purple' | 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral'> = {
  applied: 'neutral',
  screening: 'info',
  interview: 'primary',
  offer: 'warning',
  hired: 'success',
  rejected: 'danger',
};

const COLUMN_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export function KanbanPage() {
  const { applications, updateApplicationStatus } = useApplications();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>Pipeline Board</h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Drag-and-drop pipeline view of all applications.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', overflowX: 'auto', paddingBottom: 'var(--spacing-4)' }}>
        {COLUMNS.map(col => {
          const items = applications.filter(a => a.status === col);
          return (
            <div
              key={col}
              style={{
                minWidth: 240,
                background: 'var(--bg-base)',
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-4)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant={COLUMN_VARIANTS[col]}>{COLUMN_LABELS[col]}</Badge>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{items.length}</span>
              </div>
              {items.map(app => (
                <div
                  key={app.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: 'var(--spacing-3)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                  }}
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginBottom: 4 }}>{app.applicantName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>{app.jobTitle}</div>
                  <select
                    style={{ width: '100%', fontSize: '11px', padding: '3px 6px', borderRadius: 4, border: '1px solid var(--border-color)', background: 'var(--bg-base)', cursor: 'pointer' }}
                    value={app.status}
                    onChange={e => { e.stopPropagation(); updateApplicationStatus(app.id, e.target.value as ApplicationStatus); }}
                    onClick={e => e.stopPropagation()}
                  >
                    {COLUMNS.map(s => <option key={s} value={s}>{COLUMN_LABELS[s]}</option>)}
                  </select>
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', padding: 'var(--spacing-4)' }}>Empty</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
