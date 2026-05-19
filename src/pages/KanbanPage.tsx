import { useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const COLUMNS: { status: ApplicationStatus; label: string }[] = [
  { status: 'new', label: 'New' },
  { status: 'screening', label: 'Screening' },
  { status: 'interview', label: 'Interview' },
  { status: 'offer', label: 'Offer' },
  { status: 'hired', label: 'Hired' },
  { status: 'rejected', label: 'Rejected' },
];

const statusVariant: Record<ApplicationStatus, 'info' | 'warning' | 'purple' | 'primary' | 'success' | 'danger'> = {
  new: 'info',
  screening: 'warning',
  interview: 'purple',
  offer: 'primary',
  hired: 'success',
  rejected: 'danger',
};

export function KanbanPage() {
  const { applications, updateStatus } = useApplications();
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Pipeline Board</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 'var(--spacing-1)' }}>{applications.length} total applications</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', overflowX: 'auto', paddingBottom: 'var(--spacing-4)' }}>
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.status);
          return (
            <div
              key={col.status}
              style={{ minWidth: 220, maxWidth: 260, flex: '0 0 220px', background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', padding: 'var(--spacing-4)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{col.label}</span>
                <Badge variant={statusVariant[col.status]} size="sm">{colApps.length}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {colApps.map(app => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    style={{ background: 'var(--bg-base)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', padding: 'var(--spacing-3)', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                  >
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>{app.jobTitle}</div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginBottom: 8 }}>{app.applicantName}</div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                      <select
                        value={app.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => { e.stopPropagation(); updateStatus(app.id, e.target.value as ApplicationStatus); }}
                        style={{ fontSize: 'var(--font-size-xs)', padding: '2px 6px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      >
                        {COLUMNS.map(c => <option key={c.status} value={c.status}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
