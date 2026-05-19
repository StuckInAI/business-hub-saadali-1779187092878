import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Application } from '@/types';
import { useJobs, useApplications } from '@/hooks/useStorage';

export function PublicApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { applications, addApplication } = useApplications();

  const job = jobs.find(j => j.id === jobId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState('');
  const [cover, setCover] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Job not found</h2>
        <button onClick={() => navigate('/jobs')} style={{ marginTop: '1rem' }}>Back to Jobs</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Application Submitted!</h2>
        <p>Thank you for applying for <strong>{job.title}</strong>. We will be in touch soon.</p>
        <button onClick={() => navigate('/jobs')} style={{ marginTop: '1rem' }}>View More Jobs</button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const application: Application = {
      id: `a${Date.now()}`,
      jobId: job!.id,
      jobTitle: job!.title,
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      resumeText: resume,
      coverLetter: cover,
      status: 'new',
      notes: '',
      rating: 0,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addApplication(application);
    setSubmitted(true);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <button onClick={() => navigate('/jobs')} style={{ marginBottom: '1rem' }}>&larr; Back to Jobs</button>
      <h1 style={{ marginBottom: '0.5rem' }}>{job.title}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>{job.department} &bull; {job.location} &bull; {job.type}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Full Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Resume / Experience *</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} required rows={5} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Cover Letter</label>
          <textarea value={cover} onChange={e => setCover(e.target.value)} rows={4} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }} />
        </div>
        <button type="submit" style={{ padding: '10px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Submit Application</button>
      </form>
    </div>
  );
}
