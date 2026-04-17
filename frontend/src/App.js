import { useCallback, useState } from 'react';
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
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';
import ProjectBoardPage from './components/ProjectBoardPage';
import { appTheme, styles } from './App.styles';
import { useAppData } from './hooks/useAppData';

const STATUSES = ['New', 'InProgress', 'OnHold', 'Finished'];
const API = 'http://localhost:8080';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('boardapp_token') ?? '');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('boardapp_token');
    setToken('');
    setPassword('');
    setLoginError('Sesja wygasła. Zaloguj się ponownie.');
  }, []);

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
    createSubProject,
    createTask,
    updateTaskStatus,
    deleteTask,
    getUserName,
  } = useAppData(token, handleUnauthorized);

  if (!token) {
    return (
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Box sx={styles.authPage}>
          <Card elevation={3} sx={styles.authCard}>
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
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={styles.appPage}>
        <Box sx={styles.logoutButtonWrapper}>
          <Button variant="outlined" onClick={handleLogout}>Wyloguj</Button>
        </Box>

        <Container maxWidth={false} sx={styles.appContainer}>
          <Stack spacing={2.5}>
            <Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>BoardApp</Typography>
                <Typography color="text.secondary">Panel zarządzania projektami</Typography>
              </Box>
            </Box>

            {message && (
              <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            )}

            <ProjectBoardPage
              projects={projects}
              users={users}
              statuses={STATUSES}
              onCreateProject={createProject}
              onCreateSubProject={createSubProject}
              onCreateTask={createTask}
              onUpdateTaskStatus={updateTaskStatus}
              onDeleteTask={deleteTask}
              getUserName={getUserName}
            />
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

