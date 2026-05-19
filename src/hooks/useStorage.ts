import { useState, useEffect, useCallback } from 'react';
import {
  getJobs,
  saveJobs,
  getApplications,
  saveApplications,
  getUsers,
  getCurrentUserId,
  saveCurrentUserId,
} from '@/lib/storage';
import { Job, Application, ApplicationStatus, HRUser } from '@/types';

function useLocalStorage<T>(key: string, fetcher: () => T, saver: (v: T) => void) {
  const [value, setValue] = useState<T>(fetcher);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue(prev => {
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater;
        saver(next);
        return next;
      });
    },
    [saver]
  );

  return [value, update] as const;
}

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage<Job[]>('jobs', getJobs, saveJobs);

  const addJob = useCallback(
    (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) => {
      const now = new Date().toISOString();
      const newJob: Job = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        applicantCount: 0,
      };
      setJobs(prev => [...prev, newJob]);
      return newJob;
    },
    [setJobs]
  );

  const updateJob = useCallback(
    (id: string, patch: Partial<Job>) => {
      setJobs(prev =>
        prev.map(j => (j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j))
      );
    },
    [setJobs]
  );

  const deleteJob = useCallback(
    (id: string) => {
      setJobs(prev => prev.filter(j => j.id !== id));
    },
    [setJobs]
  );

  return { jobs, addJob, updateJob, deleteJob };
}

export function useApplications() {
  const [applications, setApplications] = useLocalStorage<Application[]>(
    'applications',
    getApplications,
    saveApplications
  );

  const addApplication = useCallback(
    (data: Omit<Application, 'id'>) => {
      const newApp: Application = {
        ...data,
        id: crypto.randomUUID(),
      };
      setApplications(prev => [...prev, newApp]);
      return newApp;
    },
    [setApplications]
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setApplications(prev =>
        prev.map(a =>
          a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
        )
      );
    },
    [setApplications]
  );

  const updateApplication = useCallback(
    (id: string, patch: Partial<Application>) => {
      setApplications(prev =>
        prev.map(a =>
          a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
        )
      );
    },
    [setApplications]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      setApplications(prev => prev.filter(a => a.id !== id));
    },
    [setApplications]
  );

  return {
    applications,
    addApplication,
    updateApplicationStatus,
    updateApplication,
    deleteApplication,
  };
}

export function useCurrentUser() {
  const [users] = useState<HRUser[]>(getUsers);
  const [currentUserId, setCurrentUserId] = useState<string>(getCurrentUserId);

  const currentUser = users.find(u => u.id === currentUserId) ?? users[0];

  const switchUser = useCallback((user: HRUser) => {
    setCurrentUserId(user.id);
    saveCurrentUserId(user.id);
  }, []);

  return { currentUser, users, switchUser };
}
