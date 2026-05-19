import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const statusVariant: Record<ApplicationStatus, 'info' | 'warning' | 'purple' | 'primary' | 'success' | 'danger'> = {
  new: 'info',
  screening: 'warning',
  interview: 'purple',
  offer: 'primary',
  hired: 'success',
  rejected: 'danger',
};

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { applications, updateApplication, updateStatus, deleteApplication } = useApplications();

  const application = applications.find(a => a.id === applicationId);

  if (!application) {
    return (
      <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
        <p>Application not found.</p>
        <Button onClick={() => navigate('/applications')} style={{ marginTop: 'var(--spacing-4)' } as React.CSSProperties}>Back to Applications</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/applications')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
          {application.applicantName}
        </h1>
        <Button variant="danger" size="sm" onClick={() => { deleteApplication(application.id); navigate('/applications'); }}>
          <Trash2 size={14} /> Delete
        </Button>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', padding: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{application.applicantName}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
              {application.applicantEmail}{application.applicantPhone ? ` · ${application.applicantPhone}` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
            <Badge variant={statusVariant[application.status]}>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</Badge>
            <select
              value={application.status}
              onChange={e => updateStatus(application.id, e.target.value as ApplicationStatus)}
              style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-sm)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Applied for: <strong>{application.jobTitle}</strong></span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginLeft: 'var(--spacing-4)' }}>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', padding: 'var(--spacing-5)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--spacing-3)', color: 'var(--text-primary)' }}>Resume</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{application.resumeText || 'No resume provided.'}</p>
        </div>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', padding: 'var(--spacing-5)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--spacing-3)', color: 'var(--text-primary)' }}>Cover Letter</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{application.coverLetter || 'No cover letter provided.'}</p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', padding: 'var(--spacing-5)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 'var(--spacing-3)', color: 'var(--text-primary)' }}>Notes</h3>
        <textarea
          value={application.notes}
          onChange={e => updateApplication({ ...application, notes: e.target.value })}
          rows={4}
          placeholder="Add internal notes about this applicant..."
          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', background: 'var(--bg-surface)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  );
}
