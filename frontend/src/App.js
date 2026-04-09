import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001';
const STATUSES = ['New', 'InProgress', 'OnHold', 'Finished'];

export default function App() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [subProjectName, setSubProjectName] = useState('');
  const [subProjectDescription, setSubProjectDescription] = useState('');
  const [selectedSubProjectId, setSelectedSubProjectId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');

  // Load data
  const fetchData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/projects`)
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      setMessage('Unable to reach backend API.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Project operations
  const createProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      await axios.post(`${API}/projects`, {
        Name: projectName,
        Description: projectDescription
      });
      setProjectName('');
      setProjectDescription('');
      setMessage('Project created successfully.');
      await fetchData();
    } catch (error) {
      setMessage('Failed to create project.');
    }
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await axios.put(`${API}/projects/${projectId}`, {
        Status: status
      });
      setMessage('Project status updated.');
      await fetchData();
    } catch (error) {
      setMessage('Failed to update project.');
    }
  };

  // SubProject operations
  const createSubProject = async (e) => {
    e.preventDefault();
    if (!subProjectName.trim() || !selectedProjectId) return;

    try {
      await axios.post(`${API}/projects/${selectedProjectId}/subprojects`, {
        Name: subProjectName,
        Description: subProjectDescription
      });
      setSubProjectName('');
      setSubProjectDescription('');
      setMessage('SubProject created successfully.');
      await fetchData();
    } catch (error) {
      setMessage('Failed to create subproject.');
    }
  };

  const updateSubProjectStatus = async (subProjectId, status) => {
    try {
      await axios.put(`${API}/subprojects/${subProjectId}`, {
        Status: status
      });
      setMessage('SubProject status updated.');
      await fetchData();
    } catch (error) {
      setMessage('Failed to update subproject.');
    }
  };

  // Task operations
  const createTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedSubProjectId) return;

    try {
      await axios.post(`${API}/subprojects/${selectedSubProjectId}/tasks`, {
        Title: taskTitle,
        Description: taskDescription,
        AssigneeId: taskAssigneeId ? Number(taskAssigneeId) : null
      });
      setTaskTitle('');
      setTaskDescription('');
      setTaskAssigneeId('');
      setMessage('Task created successfully.');
      await fetchData();
    } catch (error) {
      setMessage('Failed to create task.');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`${API}/tasks/${taskId}`, {
        Status: status
      });
      setMessage('Task status updated.');
      await fetchData();
    } catch (error) {
      setMessage('Failed to update task.');
    }
  };

  const getSelectedProject = () => projects.find(p => p.Id === Number(selectedProjectId));
  const getSelectedSubProject = () => getSelectedProject()?.SubProjects.find(sp => sp.Id === Number(selectedSubProjectId));
  const getUserName = (userId) => users.find(u => u.Id === userId)?.Name || 'Unassigned';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', maxWidth: '1200px' }}>
      <h1>📊 BoardApp</h1>
      <p>Project → SubProject → Task hierarchy manager</p>

      {message && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '10px', 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Create Project */}
        <section style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
          <h2>➕ Create Project</h2>
          <form onSubmit={createProject} style={{ display: 'grid', gap: '8px' }}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              required
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Description"
              rows="3"
            />
            <button type="submit">Create Project</button>
          </form>
        </section>

        {/* Create SubProject */}
        <section style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
          <h2>➕ Create SubProject</h2>
          <form onSubmit={createSubProject} style={{ display: 'grid', gap: '8px' }}>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.Id} value={p.Id}>{p.Name}</option>
              ))}
            </select>
            <input
              value={subProjectName}
              onChange={(e) => setSubProjectName(e.target.value)}
              placeholder="SubProject name"
              required
            />
            <textarea
              value={subProjectDescription}
              onChange={(e) => setSubProjectDescription(e.target.value)}
              placeholder="Description"
              rows="3"
            />
            <button type="submit">Create SubProject</button>
          </form>
        </section>
      </div>

      {/* Create Task */}
      {selectedProjectId && getSelectedProject()?.SubProjects.length > 0 && (
        <section style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
          <h2>➕ Create Task</h2>
          <form onSubmit={createTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxWidth: '600px' }}>
            <select
              value={selectedSubProjectId}
              onChange={(e) => setSelectedSubProjectId(e.target.value)}
              required
            >
              <option value="">Select a subproject</option>
              {getSelectedProject()?.SubProjects.map(sp => (
                <option key={sp.Id} value={sp.Id}>{sp.Name}</option>
              ))}
            </select>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              required
            />
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task details"
              rows="2"
              style={{ gridColumn: '1 / -1' }}
            />
            <select 
              value={taskAssigneeId} 
              onChange={(e) => setTaskAssigneeId(e.target.value)}
              style={{ gridColumn: '1 / -1' }}
            >
              <option value="">Assign to...</option>
              {users.map(u => (
                <option key={u.Id} value={u.Id}>{u.Name}</option>
              ))}
            </select>
            <button type="submit" style={{ gridColumn: '1 / -1' }}>Create Task</button>
          </form>
        </section>
      )}

      {/* Display Projects */}
      <section>
        <h2>📁 Projects</h2>
        {projects.length === 0 ? (
          <p style={{ color: '#666' }}>No projects yet.</p>
        ) : (
          projects.map(project => (
            <div key={project.Id} style={{
              border: '2px solid #1976d2',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{project.Name}</h3>
                  <p style={{ margin: '0 0 12px 0', color: '#666' }}>{project.Description}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={project.Status}
                    onChange={(e) => updateProjectStatus(project.Id, e.target.value)}
                    style={{ padding: '6px' }}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SubProjects */}
              <div style={{ marginTop: '16px' }}>
                <strong style={{ display: 'block', marginBottom: '12px' }}>📂 SubProjects</strong>
                {project.SubProjects.length === 0 ? (
                  <p style={{ color: '#999', marginLeft: '12px' }}>No subprojects yet.</p>
                ) : (
                  project.SubProjects.map(subProject => (
                    <div key={subProject.Id} style={{
                      border: '1px solid #90caf9',
                      borderRadius: '6px',
                      padding: '12px',
                      marginBottom: '12px',
                      marginLeft: '12px',
                      backgroundColor: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 6px 0' }}>{subProject.Name}</h4>
                          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9em' }}>
                            {subProject.Description}
                          </p>
                        </div>
                        <select
                          value={subProject.Status}
                          onChange={(e) => updateSubProjectStatus(subProject.Id, e.target.value)}
                          style={{ padding: '4px', fontSize: '0.9em' }}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tasks */}
                      <div style={{ marginTop: '12px', marginLeft: '8px' }}>
                        <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.95em' }}>✓ Tasks</strong>
                        {subProject.Tasks.length === 0 ? (
                          <p style={{ color: '#ccc', fontSize: '0.9em', margin: '0' }}>No tasks yet.</p>
                        ) : (
                          <ul style={{ margin: '0', paddingLeft: '20px' }}>
                            {subProject.Tasks.map(task => (
                              <li key={task.Id} style={{ marginBottom: '8px', fontSize: '0.9em' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                  <div style={{ flex: 1 }}>
                                    <strong>{task.Title}</strong>
                                    {task.Description && (
                                      <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                                        {task.Description}
                                      </p>
                                    )}
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85em', color: '#999' }}>
                                      Assigned to: <em>{getUserName(task.AssigneeId)}</em>
                                    </p>
                                  </div>
                                  <select
                                    value={task.Status}
                                    onChange={(e) => updateTaskStatus(task.Id, e.target.value)}
                                    style={{ padding: '4px', fontSize: '0.8em' }}
                                  >
                                    {STATUSES.map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
