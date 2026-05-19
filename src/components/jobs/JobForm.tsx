import { useState } from 'react';
import { Job, Department, JobType, JobStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import styles from './JobForm.module.css';

type JobFormProps = {
  initial?: Partial<Job>;
  onSubmit: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) => void;
  onCancel: () => void;
  postedBy: string;
};

export function JobForm({ initial, onSubmit, onCancel, postedBy }: JobFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [department, setDepartment] = useState<Department>(initial?.department ?? 'engineering');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [type, setType] = useState<JobType>(initial?.type ?? 'full-time');
  const [status, setStatus] = useState<JobStatus>(initial?.status ?? 'active');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [salary, setSalary] = useState(initial?.salary ?? '');
  const [reqText, setReqText] = useState((initial?.requirements ?? []).join('\n'));

  const departments: Department[] = ['engineering', 'design', 'marketing', 'sales', 'hr', 'finance', 'operations', 'product'];
  const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
  const statuses: JobStatus[] = ['active', 'paused', 'closed'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const requirements = reqText.split('\n').map(r => r.trim()).filter(Boolean);
    onSubmit({ title, department, location, type, status, description, salary, requirements, postedBy });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label}>Job Title *</label>
          <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Senior Frontend Engineer" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Department *</label>
          <select className={styles.select} value={department} onChange={e => setDepartment(e.target.value as Department)} required>
            {departments.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Location *</label>
          <input className={styles.input} value={location} onChange={e => setLocation(e.target.value)} required placeholder="e.g. New York, NY or Remote" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Job Type *</label>
          <select className={styles.select} value={type} onChange={e => setType(e.target.value as JobType)} required>
            {jobTypes.map(t => <option key={t} value={t}>{t.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} value={status} onChange={e => setStatus(e.target.value as JobStatus)}>
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Salary Range</label>
          <input className={styles.input} value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. $100,000 - $130,000" />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Description *</label>
        <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="Describe the role, team, and responsibilities..." />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Requirements (one per line)</label>
        <textarea className={styles.textarea} value={reqText} onChange={e => setReqText(e.target.value)} rows={4} placeholder="5+ years experience\nTypeScript proficiency\n..." />
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit">Save Job</Button>
      </div>
    </form>
  );
}
