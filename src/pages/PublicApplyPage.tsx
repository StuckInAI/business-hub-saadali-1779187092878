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
  const [cover, setCover] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job) return <div style={{ padding: '2rem' }}>Job not found.</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    addApplication({
      jobId: job!.id,
      jobTitle: job!.title,
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      coverLetter: cover,
      resumeUrl: '',
      status: 'applied',
      appliedAt: now,
      updatedAt: now,
      notes: '',
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Application Submitted!</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Thank you for applying to <strong>{job.title}</strong>. We'll be in touch!</p>
        <Button onClick={() => navigate('/jobs')}>Browse More Jobs</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '2rem auto', padding: '0 1rem' }}>
      <button
        onClick={() => navigate('/jobs')}
        style={{ marginBottom: '1rem', background: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        &larr; Back to Jobs
      </button>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Apply for {job.title}</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{job.department} · {job.location}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '0.875rem' }}>Full Name *</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '0.875rem' }}>Email *</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '0.875rem' }}>Phone</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '0.875rem' }}>Cover Letter</label>
          <textarea
            value={cover}
            onChange={e => setCover(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem', resize: 'vertical' }}
            placeholder="Tell us why you're interested in this role..."
          />
        </div>
        <Button type="submit">Submit Application</Button>
      </form>
    </div>
  );
}
