import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const api = 'http://localhost:5001';

function App() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes, tasksRes] = await Promise.all([
        axios.get(`${api}/users`),
        axios.get(`${api}/projects`),
        axios.get(`${api}/tasks`)
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      setMessage('Unable to reach backend API.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const projectOptions = useMemo(
    () => projects.map((project) => (
      <option key={project.Id} value={project.Id}>
        {project.Name}
      </option>
    )),
    [projects]
  );

  const userOptions = useMemo(
    () => [<option key="none" value="">Unassigned</option>, ...users.map((user) => (
      <option key={user.Id} value={user.Id}>{user.Name}</option>
    ))],
    [users]
  );

  const createProject = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${api}/projects`, {
        Name: projectName,
        Description: projectDescription
      });
      setProjectName('');
      setProjectDescription('');
      setMessage('Project created successfully.');
      fetchData();
    } catch (error) {
      setMessage('Failed to create project.');
    }
  };

  const createTask = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${api}/tasks`, {
        Title: taskTitle,
        Description: taskDescription,
        ProjectId: Number(taskProjectId),
        AssigneeId: taskAssigneeId ? Number(taskAssigneeId) : null,
        Status: 'Todo'
      });
      setTaskTitle('');
      setTaskDescription('');
      setTaskProjectId('');
      setTaskAssigneeId('');
      setMessage('Task created successfully.');
      fetchData();
    } catch (error) {
      setMessage('Failed to create task.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>BoardApp</h1>
      <p>Simple in-memory project and task manager.</p>

      {message && <div style={{ marginBottom: '16px', color: 'teal' }}>{message}</div>}

      <section style={{ marginBottom: '32px' }}>
        <h2>Create a project</h2>
        <form onSubmit={createProject} style={{ display: 'grid', gap: '8px', maxWidth: '400px' }}>
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project name"
            required
          />
          <textarea
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
            placeholder="Description"
          />
          <button type="submit">Create project</button>
        </form>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2>Create a task</h2>
        <form onSubmit={createTask} style={{ display: 'grid', gap: '8px', maxWidth: '400px' }}>
          <input
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Task title"
            required
          />
          <textarea
            value={taskDescription}
            onChange={(event) => setTaskDescription(event.target.value)}
            placeholder="Task details"
          />
          <select
            value={taskProjectId}
            onChange={(event) => setTaskProjectId(event.target.value)}
            required
          >
            <option value="">Select a project</option>
            {projectOptions}
          </select>
          <select value={taskAssigneeId} onChange={(event) => setTaskAssigneeId(event.target.value)}>
            {userOptions}
          </select>
          <button type="submit">Create task</button>
        </form>
      </section>

      <section>
        <h2>Projects</h2>
        {projects.length === 0 && <p>No projects yet.</p>}
        {projects.map((project) => (
          <div key={project.Id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '12px' }}>
            <h3>{project.Name}</h3>
            <p>{project.Description}</p>
            <div>
              <strong>Tasks</strong>
              {tasks.filter((task) => task.ProjectId === project.Id).length === 0 ? (
                <p>No tasks for this project.</p>
              ) : (
                <ul>
                  {tasks
                    .filter((task) => task.ProjectId === project.Id)
                    .map((task) => (
                      <li key={task.Id}>
                        <strong>{task.Title}</strong> — {task.Description || 'No description'}
                        <br />
                        Status: {task.Status}
                        <br />
                        Assigned to:{' '}
                        {task.AssigneeId ? users.find((user) => user.Id === task.AssigneeId)?.Name : 'Unassigned'}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
