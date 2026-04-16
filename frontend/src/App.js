import { useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material';
import ProjectsTab from './components/tabs/ProjectsTab';
import SubProjectsTab from './components/tabs/SubProjectsTab';
import TasksTab from './components/tabs/TasksTab';
import { useAppData } from './hooks/useAppData';

const STATUSES = ['New', 'InProgress', 'OnHold', 'Finished'];
const TABS = {
  projects: 'projects',
  subprojects: 'subprojects',
  tasks: 'tasks'
};
const API = 'http://localhost:8080';

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
  const [activeTab, setActiveTab] = useState(TABS.projects);
  const [token, setToken] = useState(localStorage.getItem('boardapp_token') ?? '');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleUnauthorized = () => {
    localStorage.removeItem('boardapp_token');
    setToken('');
    setPassword('');
    setLoginError('Sesja wygasła. Zaloguj się ponownie.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await axios.post(`${API}/auth/login`, {
        Username: username,
        Password: password,
      });

      const newToken = response.data?.Token;
      if (!newToken) {
        setLoginError('Nie udało się pobrać tokenu.');
        return;
      }

      localStorage.setItem('boardapp_token', newToken);
      setToken(newToken);
      setPassword('');
    } catch {
      setLoginError('Nieprawidłowy login lub hasło.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('boardapp_token');
    setToken('');
    setPassword('');
    setLoginError('');
  };

  const {
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
  } = useAppData(token, handleUnauthorized);

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            px: 2,
            background: 'linear-gradient(140deg, #f5faf8 0%, #edf4ff 100%)'
          }}
        >
          <Card elevation={3} sx={{ width: '100%', maxWidth: 420 }}>
            <CardContent>
              <Stack spacing={2.5} component="form" onSubmit={handleLogin}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>BoardApp</Typography>
                  <Typography color="text.secondary">Zaloguj się</Typography>
                </Box>

                {loginError && <Alert severity="error">{loginError}</Alert>}

                <TextField
                  label="Login"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
                <TextField
                  label="Hasło"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" variant="contained" size="large">Zaloguj</Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

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
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>BoardApp</Typography>
                  <Typography color="text.secondary">Panel zarządzania projektami</Typography>
                </Box>
                <Button variant="outlined" onClick={handleLogout}>Wyloguj</Button>
              </Stack>
            </Box>

            {message && (
              <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            )}

            <Card elevation={2}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="fullWidth"
              >
                <Tab label="Projekty" value={TABS.projects} />
                <Tab label="Podprojekty" value={TABS.subprojects} />
                <Tab label="Zadania" value={TABS.tasks} />
              </Tabs>
            </Card>

            {activeTab === TABS.projects && (
              <ProjectsTab
                projects={projects}
                statuses={STATUSES}
                onCreateProject={createProject}
                onUpdateStatus={updateProjectStatus}
                onDelete={deleteProject}
              />
            )}

            {activeTab === TABS.subprojects && (
              <SubProjectsTab
                projects={projects}
                statuses={STATUSES}
                onCreateSubProject={createSubProject}
                onUpdateStatus={updateSubProjectStatus}
                onDelete={deleteSubProject}
              />
            )}

            {activeTab === TABS.tasks && (
              <TasksTab
                projects={projects}
                users={users}
                statuses={STATUSES}
                onCreateTask={createTask}
                onUpdateStatus={updateTaskStatus}
                onDelete={deleteTask}
                getUserName={getUserName}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

