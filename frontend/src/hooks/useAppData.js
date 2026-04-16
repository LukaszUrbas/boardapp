import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';
const STATUS_BY_ID = ['New', 'InProgress', 'OnHold', 'Finished'];

function normalizeStatus(status) {
  if (typeof status === 'number') return STATUS_BY_ID[status] ?? 'New';
  return status ?? 'New';
}

function normalizeProjects(projects) {
  return projects.map(project => ({
    ...project,
    Status: normalizeStatus(project.Status),
    SubProjects: (project.SubProjects ?? []).map(subProject => ({
      ...subProject,
      Status: normalizeStatus(subProject.Status),
      Tasks: (subProject.Tasks ?? []).map(task => ({
        ...task,
        Status: normalizeStatus(task.Status),
      })),
    })),
  }));
}

export function useAppData() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/projects`),
      ]);
      setUsers(usersRes.data);
      setProjects(normalizeProjects(projectsRes.data));
    } catch {
      setMessage('Nie można połączyć się z API.');
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ===== PROJECTS =====

  const createProject = useCallback(async ({ name, description }) => {
    try {
      await axios.post(`${API}/projects`, { Name: name, Description: description });
      await fetchData();
      setMessage('Projekt utworzony.');
      return true;
    } catch {
      setMessage('Błąd tworzenia projektu.');
      return false;
    }
  }, [fetchData]);

  const updateProjectStatus = useCallback(async (projectId, status) => {
    setProjects(prev => prev.map(p => p.Id === projectId ? { ...p, Status: status } : p));
    try {
      await axios.put(`${API}/projects/${projectId}`, { Status: status });
    } catch {
      setMessage('Błąd aktualizacji statusu.');
      await fetchData();
    }
  }, [fetchData]);

  const deleteProject = useCallback(async (projectId) => {
    if (!window.confirm('Czy na pewno usunąć projekt wraz z podprojektami i zadaniami?')) return;
    try {
      await axios.delete(`${API}/projects/${projectId}`);
      await fetchData();
      setMessage('Projekt usunięty.');
    } catch {
      setMessage('Błąd usuwania projektu.');
    }
  }, [fetchData]);

  // ===== SUBPROJECTS =====

  const createSubProject = useCallback(async (projectId, { name, description }) => {
    try {
      await axios.post(`${API}/projects/${projectId}/subprojects`, { Name: name, Description: description });
      await fetchData();
      setMessage('Podprojekt utworzony.');
      return true;
    } catch {
      setMessage('Błąd tworzenia podprojektu.');
      return false;
    }
  }, [fetchData]);

  const updateSubProjectStatus = useCallback(async (subProjectId, status) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      SubProjects: p.SubProjects.map(sp =>
        sp.Id === subProjectId ? { ...sp, Status: status } : sp
      ),
    })));
    try {
      await axios.put(`${API}/subprojects/${subProjectId}`, { Status: status });
    } catch {
      setMessage('Błąd aktualizacji statusu.');
      await fetchData();
    }
  }, [fetchData]);

  const deleteSubProject = useCallback(async (subProjectId) => {
    if (!window.confirm('Czy na pewno usunąć podprojekt wraz z zadaniami?')) return;
    try {
      await axios.delete(`${API}/subprojects/${subProjectId}`);
      await fetchData();
      setMessage('Podprojekt usunięty.');
    } catch {
      setMessage('Błąd usuwania podprojektu.');
    }
  }, [fetchData]);

  // ===== TASKS =====

  const createTask = useCallback(async (subProjectId, { title, description, assigneeId }) => {
    try {
      await axios.post(`${API}/subprojects/${subProjectId}/tasks`, {
        Title: title,
        Description: description,
        AssigneeId: assigneeId ? Number(assigneeId) : null,
      });
      await fetchData();
      setMessage('Zadanie utworzone.');
      return true;
    } catch {
      setMessage('Błąd tworzenia zadania.');
      return false;
    }
  }, [fetchData]);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      SubProjects: p.SubProjects.map(sp => ({
        ...sp,
        Tasks: sp.Tasks.map(t => t.Id === taskId ? { ...t, Status: status } : t),
      })),
    })));
    try {
      await axios.put(`${API}/tasks/${taskId}`, { Status: status });
    } catch {
      setMessage('Błąd aktualizacji statusu.');
      await fetchData();
    }
  }, [fetchData]);

  const deleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Czy na pewno usunąć zadanie?')) return;
    try {
      await axios.delete(`${API}/tasks/${taskId}`);
      await fetchData();
      setMessage('Zadanie usunięte.');
    } catch {
      setMessage('Błąd usuwania zadania.');
    }
  }, [fetchData]);

  const getUserName = useCallback(
    (userId) => users.find(u => u.Id === userId)?.Name ?? 'Nieprzypisany',
    [users]
  );

  return {
    users,
    projects,
    message,
    setMessage,
    createProject,
    updateProjectStatus,
    deleteProject,
    createSubProject,
    updateSubProjectStatus,
    deleteSubProject,
    createTask,
    updateTaskStatus,
    deleteTask,
    getUserName,
  };
}
