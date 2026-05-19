import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2 } from 'lucide-react';
import { useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';
import styles from './ApplicationsPage.module.css';

const ALL_STATUSES: ApplicationStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const statusVariant: Record<ApplicationStatus, 'info' | 'warning' | 'purple' | 'primary' | 'success' | 'danger'> = {
  new: 'info',
  screening: 'warning',
  interview: 'purple',
  offer: 'primary',
  hired: 'success',
  rejected: 'danger',
};

export function ApplicationsPage() {
  const navigate = useNavigate();
  const { applications, updateStatus, deleteApplication } = useApplications();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');

  const filtered = applications.filter(app => {
    const matchSearch =
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Applications</h1>
          <p className={styles.subtitle}>{applications.length} total applications</p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by job, name, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
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
            <div>Applicant</div>
            <div>Job</div>
            <div>Status</div>
            <div>Applied</div>
            <div>Actions</div>
          </div>
          {filtered.map(app => (
            <div key={app.id} className={styles.tableRow} onClick={() => navigate(`/applications/${app.id}`)}>
              <div>
                <div className={styles.applicantName}>{app.applicantName}</div>
                <div className={styles.applicantEmail}>{app.applicantEmail}</div>
              </div>
              <div className={styles.jobTitle}>{app.jobTitle}</div>
              <div>
                <select
                  value={app.status}
                  onClick={e => e.stopPropagation()}
                  onChange={e => { e.stopPropagation(); updateStatus(app.id, e.target.value as ApplicationStatus); }}
                  className={styles.statusSelect}
                >
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <Badge variant={statusVariant[app.status]} size="sm">{app.status}</Badge>
              </div>
              <div className={styles.date}>{new Date(app.appliedAt).toLocaleDateString()}</div>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => { e.stopPropagation(); deleteApplication(app.id); }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
