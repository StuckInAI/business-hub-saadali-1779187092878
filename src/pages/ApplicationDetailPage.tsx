import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

const STATUS_VARIANTS: Record<ApplicationStatus, 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'purple'> = {
  applied: 'neutral',
  screening: 'info',
  interview: 'primary',
  offer: 'warning',
  hired: 'success',
  rejected: 'danger',
};

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { applications, updateApplicationStatus, updateApplication, deleteApplication } = useApplications();

  const application = applications.find(a => a.id === applicationId);
  if (!application) return <div style={{ padding: 'var(--spacing-6)' }}>Application not found.</div>;

  function handleDelete() {
    if (confirm('Delete this application?')) {
      deleteApplication(application!.id);
      navigate('/applications');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: 720 }}>
      <button
        onClick={() => navigate('/applications')}
        style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}
      >
        &larr; Back to Applications
      </button>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>{application.applicantName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{application.applicantEmail} · {application.applicantPhone}</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant={STATUS_VARIANTS[application.status]}>{STATUS_LABELS[application.status]}</Badge>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Applied for: <strong>{application.jobTitle}</strong></span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>on {new Date(application.appliedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)' }}>
        <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>Update Status</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
            <Button
              key={s}
              size="sm"
              variant={application.status === s ? 'primary' : 'secondary'}
              onClick={() => updateApplicationStatus(application.id, s)}
            >
              {STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
      </div>

      {application.coverLetter && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>Cover Letter</h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{application.coverLetter}</p>
        </div>
      )}

      {application.notes && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>Notes</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{application.notes}</p>
        </div>
      )}

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', padding: 'var(--spacing-6)' }}>
        <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>Add / Edit Notes</h2>
        <textarea
          value={application.notes}
          onChange={e => updateApplication(application.id, { notes: e.target.value })}
          rows={4}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-sm)', resize: 'vertical' }}
          placeholder="Add internal notes about this applicant..."
        />
      </div>
    </div>
  );
}
