import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs, useApplications } from '@/hooks/useStorage';
import { Application } from '@/types';
import { Button } from '@/components/ui/Button';

export function PublicApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { addApplication } = useApplications();

  const job = jobs.find(j => j.id === jobId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState('');
  const [cover, setCover] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Job not found.</p>
        <Button onClick={() => navigate('/jobs')} style={{ marginTop: 16 } as React.CSSProperties}>Back to Jobs</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Application Submitted!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Thank you for applying for <strong>{job.title}</strong>. We will review your application shortly.</p>
        <Button onClick={() => navigate('/jobs')}>View More Jobs</Button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    const application: Application = {
      id: `app_${Date.now()}`,
      jobId: job!.id,
      jobTitle: job!.title,
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      resumeText: resume,
      coverLetter: cover,
      status: 'new',
      notes: '',
      appliedAt: now,
      updatedAt: now,
    };
    addApplication(application);
    setSubmitted(true);
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Apply for {job.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>{job.department} · {job.location} · {job.type}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Full Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' } as React.CSSProperties} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' } as React.CSSProperties} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Phone</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' } as React.CSSProperties} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Resume / Experience *</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} required rows={5} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' } as React.CSSProperties} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Cover Letter</label>
          <textarea value={cover} onChange={e => setCover(e.target.value)} rows={4} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' } as React.CSSProperties} />
        </div>
        <Button type="submit">Submit Application</Button>
      </form>
    </div>
  );
}
