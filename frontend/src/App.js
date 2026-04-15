import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Card,
  Container,
  CssBaseline,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material';
import ProjectsTab from './components/tabs/ProjectsTab';
import SubProjectsTab from './components/tabs/SubProjectsTab';
import TasksTab from './components/tabs/TasksTab';

const API = 'http://localhost:8080';
const STATUSES = ['New', 'InProgress', 'OnHold', 'Finished'];
const TABS = {
  projects: 'projects',
  subprojects: 'subprojects',
  tasks: 'tasks'
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e'
    },
    secondary: {
      main: '#ea580c'
    },
    background: {
      default: '#f4f8fb',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 14
  }
});

export default function App() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(TABS.projects);

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
  const [subProjectFilterProjectId, setSubProjectFilterProjectId] = useState('');
  const [taskFilterProjectId, setTaskFilterProjectId] = useState('');
  const [taskFilterSubProjectId, setTaskFilterSubProjectId] = useState('');

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

  useEffect(() => {
    if (
      selectedProjectId &&
      !projects.some(p => p.Id === Number(selectedProjectId))
    ) {
      setSelectedProjectId('');
      setSelectedSubProjectId('');
    }

    if (selectedProjectId) {
      const selectedProject = projects.find(p => p.Id === Number(selectedProjectId));
      const selectedSubExists = selectedProject?.SubProjects.some(
        sp => sp.Id === Number(selectedSubProjectId)
      );

      if (!selectedSubExists) {
        setSelectedSubProjectId('');
      }
    }

    if (
      subProjectFilterProjectId &&
      !projects.some(p => p.Id === Number(subProjectFilterProjectId))
    ) {
      setSubProjectFilterProjectId('');
    }

    if (
      taskFilterProjectId &&
      !projects.some(p => p.Id === Number(taskFilterProjectId))
    ) {
      setTaskFilterProjectId('');
      setTaskFilterSubProjectId('');
    }
  }, [projects, selectedProjectId, selectedSubProjectId, subProjectFilterProjectId, taskFilterProjectId]);

  useEffect(() => {
    const selectedProject = projects.find(p => p.Id === Number(taskFilterProjectId));
    const hasSelectedSubproject = selectedProject?.SubProjects.some(
      sp => sp.Id === Number(taskFilterSubProjectId)
    );

    if (!selectedProject || selectedProject.SubProjects.length === 0 || !hasSelectedSubproject) {
      setTaskFilterSubProjectId('');
    }
  }, [projects, taskFilterProjectId, taskFilterSubProjectId]);

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

  const deleteProject = async (projectId) => {
    if (!window.confirm('Czy na pewno usunac projekt wraz z podprojektami i zadaniami?')) {
      return;
    }

    try {
      await axios.delete(`${API}/projects/${projectId}`);
      setMessage('Projekt usuniety.');
      await fetchData();
    } catch (error) {
      setMessage('Nie udalo sie usunac projektu.');
    }
  };

  const deleteSubProject = async (subProjectId) => {
    if (!window.confirm('Czy na pewno usunac podprojekt wraz z zadaniami?')) {
      return;
    }

    try {
      await axios.delete(`${API}/subprojects/${subProjectId}`);
      setMessage('Podprojekt usuniety.');
      await fetchData();
    } catch (error) {
      setMessage('Nie udalo sie usunac podprojektu.');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Czy na pewno usunac zadanie?')) {
      return;
    }

    try {
      await axios.delete(`${API}/tasks/${taskId}`);
      setMessage('Zadanie usuniete.');
      await fetchData();
    } catch (error) {
      setMessage('Nie udalo sie usunac zadania.');
    }
  };

  const getSelectedProject = () => projects.find(p => p.Id === Number(selectedProjectId));
  const getUserName = (userId) => users.find(u => u.Id === userId)?.Name || 'Unassigned';
  const filteredSubProjects = projects.find(
    p => p.Id === Number(subProjectFilterProjectId)
  )?.SubProjects || [];
  const taskFilterProject = projects.find(p => p.Id === Number(taskFilterProjectId));
  const filteredTasks = taskFilterProject?.SubProjects.find(
    sp => sp.Id === Number(taskFilterSubProjectId)
  )?.Tasks || [];
  const selectedProject = projects.find(p => p.Id === Number(selectedProjectId));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          background: 'linear-gradient(140deg, #f5faf8 0%, #edf4ff 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" fontWeight={700}>BoardApp</Typography>
              <Typography color="text.secondary">Panel z zakladkami oparty o Material UI</Typography>
            </Box>

            {message && <Alert severity="success">{message}</Alert>}

            <Card elevation={2}>
              <Tabs
                value={activeTab}
                onChange={(event, value) => setActiveTab(value)}
                variant="fullWidth"
              >
                <Tab label="Projekty" value={TABS.projects} />
                <Tab label="Podprojekty" value={TABS.subprojects} />
                <Tab label="Zadania" value={TABS.tasks} />
              </Tabs>
            </Card>

            {activeTab === TABS.projects && (
              <ProjectsTab
                projectName={projectName}
                setProjectName={setProjectName}
                projectDescription={projectDescription}
                setProjectDescription={setProjectDescription}
                createProject={createProject}
                projects={projects}
                statuses={STATUSES}
                updateProjectStatus={updateProjectStatus}
                deleteProject={deleteProject}
              />
            )}

            {activeTab === TABS.subprojects && (
              <SubProjectsTab
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                subProjectName={subProjectName}
                setSubProjectName={setSubProjectName}
                subProjectDescription={subProjectDescription}
                setSubProjectDescription={setSubProjectDescription}
                createSubProject={createSubProject}
                projects={projects}
                subProjectFilterProjectId={subProjectFilterProjectId}
                setSubProjectFilterProjectId={setSubProjectFilterProjectId}
                filteredSubProjects={filteredSubProjects}
                statuses={STATUSES}
                updateSubProjectStatus={updateSubProjectStatus}
                deleteSubProject={deleteSubProject}
              />
            )}

            {activeTab === TABS.tasks && (
              <TasksTab
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                selectedSubProjectId={selectedSubProjectId}
                setSelectedSubProjectId={setSelectedSubProjectId}
                taskTitle={taskTitle}
                setTaskTitle={setTaskTitle}
                taskDescription={taskDescription}
                setTaskDescription={setTaskDescription}
                taskAssigneeId={taskAssigneeId}
                setTaskAssigneeId={setTaskAssigneeId}
                createTask={createTask}
                projects={projects}
                selectedProject={selectedProject}
                users={users}
                taskFilterProjectId={taskFilterProjectId}
                setTaskFilterProjectId={setTaskFilterProjectId}
                taskFilterSubProjectId={taskFilterSubProjectId}
                setTaskFilterSubProjectId={setTaskFilterSubProjectId}
                taskFilterProject={taskFilterProject}
                filteredTasks={filteredTasks}
                statuses={STATUSES}
                getUserName={getUserName}
                updateTaskStatus={updateTaskStatus}
                deleteTask={deleteTask}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
