import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '@/hooks/useStorage';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase } from 'lucide-react';

export function PublicJobBoardPage() {
  const { jobs } = useJobs();
  const [search, setSearch] = useState('');

  const activeJobs = jobs.filter(
    j =>
      j.status === 'active' &&
      (search === '' ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Open Positions</h1>
          <p style={{ color: 'var(--text-muted)' }}>Find your next opportunity with us</p>
        </div>
        <input
          style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          placeholder="Search by title, department, or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {activeJobs.length === 0 ? (
          <EmptyState icon={<Briefcase size={40} />} title="No open positions" description="Check back later for new opportunities." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeJobs.map(job => (
              <div key={job.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{job.title}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <Badge variant="primary">{job.department}</Badge>
                    <Badge variant="info">{job.type}</Badge>
                    <Badge variant="neutral">{job.location}</Badge>
                  </div>
                  {job.salary && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{job.salary}</p>}
                </div>
                <Link
                  to={`/jobs/${job.id}/apply`}
                  style={{ background: 'var(--color-primary)', color: 'white', padding: '8px 18px', borderRadius: 'var(--border-radius-sm)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
