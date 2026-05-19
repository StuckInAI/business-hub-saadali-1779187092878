import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { JobsPage } from '@/pages/JobsPage';
import { JobDetailPage } from '@/pages/JobDetailPage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { KanbanPage } from '@/pages/KanbanPage';
import { PublicJobBoardPage } from '@/pages/PublicJobBoardPage';
import { PublicApplyPage } from '@/pages/PublicApplyPage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/jobs" element={<PublicJobBoardPage />} />
        <Route path="/jobs/:jobId/apply" element={<PublicApplyPage />} />

        {/* HR routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="job-listings" element={<JobsPage />} />
          <Route path="job-listings/:jobId" element={<JobDetailPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
