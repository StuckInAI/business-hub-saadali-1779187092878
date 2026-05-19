import { useState, useCallback } from 'react';
import {
  getJobs, saveJob, deleteJob, createJob,
  getApplications, saveApplication, createApplication, addComment, addMessage,
  getStages, saveStages,
  getUsers, getCurrentUser, setCurrentUser,
} from '@/lib/storage';
import { Job, Application, PipelineStage, HRUser, Comment, Message } from '@/types';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(() => getJobs());

  const refresh = useCallback(() => setJobs(getJobs()), []);

  const add = useCallback((data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) => {
    const job = createJob(data);
    setJobs(getJobs());
    return job;
  }, []);

  const update = useCallback((job: Job) => {
    saveJob({ ...job, updatedAt: new Date().toISOString() });
    setJobs(getJobs());
  }, []);

  const remove = useCallback((id: string) => {
    deleteJob(id);
    setJobs(getJobs());
  }, []);

  return { jobs, refresh, add, update, remove };
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() => getApplications());

  const refresh = useCallback(() => setApplications(getApplications()), []);

  const add = useCallback((data: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'comments' | 'messages' | 'status' | 'stageId'>) => {
    const app = createApplication(data);
    setApplications(getApplications());
    return app;
  }, []);

  const update = useCallback((app: Application) => {
    saveApplication({ ...app, updatedAt: new Date().toISOString() });
    setApplications(getApplications());
  }, []);

  const comment = useCallback((applicationId: string, author: HRUser, content: string): Comment => {
    const c = addComment(applicationId, author, content);
    setApplications(getApplications());
    return c;
  }, []);

  const message = useCallback((applicationId: string, senderName: string, content: string, fromHR: boolean): Message => {
    const m = addMessage(applicationId, senderName, content, fromHR);
    setApplications(getApplications());
    return m;
  }, []);

  return { applications, refresh, add, update, comment, message };
}

export function useStages() {
  const [stages, setStages] = useState<PipelineStage[]>(() => getStages());

  const update = useCallback((stages: PipelineStage[]) => {
    saveStages(stages);
    setStages(getStages());
  }, []);

  return { stages, update };
}

export function useCurrentUser() {
  const [currentUser, setUser] = useState<HRUser>(() => getCurrentUser());
  const users = getUsers();

  const switchUser = useCallback((user: HRUser) => {
    setCurrentUser(user);
    setUser(user);
  }, []);

  return { currentUser, users, switchUser };
}
