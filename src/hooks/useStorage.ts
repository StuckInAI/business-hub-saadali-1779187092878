import { useState, useCallback } from 'react';
import {
  getUsers,
  getJobs,
  saveJobs,
  getApplications,
  saveApplications,
  getCurrentUserId,
  saveCurrentUserId,
} from '@/lib/storage';
import { Job, Application, HRUser, ApplicationStatus } from '@/types';

// ── Current User ───────────────────────────────────────────────────────────

export function useCurrentUser() {
  const users = getUsers();
  const [currentUserId, setCurrentUserId] = useState<string>(() => getCurrentUserId());

  const currentUser = users.find(u => u.id === currentUserId) ?? users[0];

  const switchUser = useCallback((user: HRUser) => {
    setCurrentUserId(user.id);
    saveCurrentUserId(user.id);
  }, []);

  return { currentUser, users, switchUser };
}

// ── Jobs ───────────────────────────────────────────────────────────────────

export function useJobs() {
  const [jobs, setJobsState] = useState<Job[]>(() => getJobs());

  const setJobs = useCallback((updated: Job[]) => {
    setJobsState(updated);
    saveJobs(updated);
  }, []);

  const addJob = useCallback((job: Job) => {
    setJobs([...getJobs(), job]);
  }, [setJobs]);

  const updateJob = useCallback((updated: Job) => {
    setJobs(getJobs().map(j => j.id === updated.id ? updated : j));
  }, [setJobs]);

  const deleteJob = useCallback((id: string) => {
    setJobs(getJobs().filter(j => j.id !== id));
  }, [setJobs]);

  return { jobs, addJob, updateJob, deleteJob };
}

// ── Applications ───────────────────────────────────────────────────────────

export function useApplications() {
  const [applications, setAppsState] = useState<Application[]>(() => getApplications());

  const setApps = useCallback((updated: Application[]) => {
    setAppsState(updated);
    saveApplications(updated);
  }, []);

  const addApplication = useCallback((app: Application) => {
    setApps([...getApplications(), app]);
  }, [setApps]);

  const updateApplication = useCallback((updated: Application) => {
    setApps(getApplications().map(a => a.id === updated.id ? updated : a));
  }, [setApps]);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApps(getApplications().map(a =>
      a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
    ));
  }, [setApps]);

  const deleteApplication = useCallback((id: string) => {
    setApps(getApplications().filter(a => a.id !== id));
  }, [setApps]);

  return { applications, addApplication, updateApplication, updateStatus, deleteApplication };
}
