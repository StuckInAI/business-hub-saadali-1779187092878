import { useParams, useNavigate } from 'react-router-dom';
import { useApplications, useJobs } from '@/hooks/useStorage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApplicationStatus } from '@/types';

const statusVariant: Record<ApplicationStatus, 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'danger' | 'purple'> = {
  new: 'neutral',
  screening: 'info',
  interview: 'warning',
  offer: 'primary',
  hired: 'success',
  rejected: 'danger',
};

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { applications, updateApplicationStatus } = useApplications();
  const { jobs } = useJobs();

  const application = applications.find(a => a.id === applicationId);
  const job = application ? jobs.find(j => j.id === application.jobId) : undefined;

  if (!application) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Application not found</h2>
        <Button onClick={() => navigate('/applications')} style={{ marginTop: '1rem' }}>Back to Applications</Button>
      </div>
    );
  }

  const statuses: ApplicationStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="ghost" onClick={() => navigate('/applications')}>&larr; Back</Button>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {application.applicantName}
        </h1>
        <Badge variant={statusVariant[application.status]}>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</Badge>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Applicant Info</h2>
        <p><strong>Email:</strong> {application.applicantEmail}</p>
        <p><strong>Phone:</strong> {application.applicantPhone || '—'}</p>
        <p><strong>Applied For:</strong> {job?.title ?? application.jobId}</p>
        <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
        {application.coverLetter && (
          <div>
            <strong>Cover Letter:</strong>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{application.coverLetter}</p>
          </div>
        )}
        {application.resumeUrl && (
          <p><strong>Resume:</strong> <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
        )}
        {application.notes && (
          <div>
            <strong>Notes:</strong>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{application.notes}</p>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Update Status</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {statuses.map(s => (
            <Button
              key={s}
              variant={application.status === s ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => updateApplicationStatus(application.id, s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
