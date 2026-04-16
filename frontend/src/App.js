import { useState } from 'react';
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
import { useAppData } from './hooks/useAppData';

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
  const [activeTab, setActiveTab] = useState(TABS.projects);
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
  } = useAppData();

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
              <Typography variant="h4" fontWeight={700}>BoardApp</Typography>
              <Typography color="text.secondary">Panel zarządzania projektami</Typography>
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

