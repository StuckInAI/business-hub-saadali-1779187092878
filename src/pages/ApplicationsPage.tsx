import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';
import styles from './ApplicationsPage.module.css';

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

export function ApplicationsPage() {
  const navigate = useNavigate();
  const { applications, updateApplicationStatus, deleteApplication } = useApplications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const filtered = applications.filter(app => {
    const matchSearch =
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Applications</h1>
          <p>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search applicants or jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="No applications found"
          description="No applications match your current filters."
        />
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.th}>Applicant</span>
            <span className={styles.th}>Job</span>
            <span className={styles.th}>Status</span>
            <span className={styles.th}>Applied</span>
            <span className={styles.th}>Update Status</span>
            <span className={styles.th}>Actions</span>
          </div>
          <div className={styles.tableBody}>
            {filtered.map(app => (
              <div key={app.id} className={styles.row}>
                <div>
                  <div className={styles.applicantName}>{app.applicantName}</div>
                  <div className={styles.applicantEmail}>{app.applicantEmail}</div>
                </div>
                <div className={styles.jobTitle}>{app.jobTitle}</div>
                <div>
                  <Badge variant={STATUS_VARIANTS[app.status]}>{STATUS_LABELS[app.status]}</Badge>
                </div>
                <div className={styles.cell}>{new Date(app.appliedAt).toLocaleDateString()}</div>
                <div>
                  <select
                    className={styles.select}
                    value={app.status}
                    onChange={e => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.actions}>
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/applications/${app.id}`)}>View</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteApplication(app.id)}>Del</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
