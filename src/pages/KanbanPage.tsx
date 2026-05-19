import { useState } from 'react';
import { useApplications, useJobs } from '@/hooks/useStorage';
import { ApplicationStatus, Application } from '@/types';
import { Badge } from '@/components/ui/Badge';

const COLUMNS: ApplicationStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const statusVariant: Record<ApplicationStatus, 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'danger' | 'purple'> = {
  new: 'neutral',
  screening: 'info',
  interview: 'warning',
  offer: 'primary',
  hired: 'success',
  rejected: 'danger',
};

const columnLabel: Record<ApplicationStatus, string> = {
  new: 'New',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export function KanbanPage() {
  const { applications, updateApplicationStatus } = useApplications();
  const { jobs } = useJobs();
  const [dragging, setDragging] = useState<string | null>(null);

  const byStatus = (status: ApplicationStatus) => applications.filter(a => a.status === status);

  function handleDragStart(id: string) {
    setDragging(id);
  }

  function handleDrop(status: ApplicationStatus) {
    if (dragging) {
      updateApplicationStatus(dragging, status);
      setDragging(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Pipeline Board</h1>
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {COLUMNS.map(col => (
          <div
            key={col}
            style={{ minWidth: 220, flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(col)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <Badge variant={statusVariant[col]}>{columnLabel[col]}</Badge>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{byStatus(col).length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 80 }}>
              {byStatus(col).map(app => (
                <KanbanCard
                  key={app.id}
                  application={app}
                  jobTitle={jobs.find(j => j.id === app.jobId)?.title}
                  onDragStart={() => handleDragStart(app.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ application, jobTitle, onDragStart }: { application: Application; jobTitle?: string; onDragStart: () => void }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-sm)',
        padding: '0.75rem',
        cursor: 'grab',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        {application.applicantName}
      </p>
      {jobTitle && (
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{jobTitle}</p>
      )}
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
        {new Date(application.appliedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
