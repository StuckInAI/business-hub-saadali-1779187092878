import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs, useApplications } from '@/hooks/useStorage';
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
  const [coverLetter, setCoverLetter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job || job.status !== 'active') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Position not available</h2>
          <Button onClick={() => navigate('/jobs')}>View Open Positions</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '1rem' }}>Application Submitted!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Thank you for applying for <strong>{job.title}</strong>. We will be in touch soon.</p>
          <Button onClick={() => navigate('/jobs')}>View More Jobs</Button>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addApplication({
      jobId: job!.id,
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      coverLetter,
      resumeUrl: '',
      status: 'new',
      appliedAt: new Date().toISOString(),
      notes: '',
    });
    setSubmitted(true);
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: 'var(--font-size-sm)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' };
  const labelStyle = { fontSize: 'var(--font-size-sm)', fontWeight: 600 as const, color: 'var(--text-primary)', display: 'block' as const, marginBottom: '0.35rem' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Button variant="ghost" onClick={() => navigate('/jobs')} style={{ marginBottom: '1rem' }}>&larr; Back to Jobs</Button>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Apply for {job.title}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{job.department} &bull; {job.location}</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Doe" />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane@example.com" />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label style={labelStyle}>Cover Letter</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit..." />
          </div>
          <Button type="submit" size="lg">Submit Application</Button>
        </form>
      </div>
    </div>
  );
}
