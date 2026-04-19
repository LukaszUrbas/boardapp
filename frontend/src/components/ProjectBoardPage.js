import { useEffect, useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import KanbanBoard from './common/KanbanBoard';

export default function ProjectBoardPage({
  projects,
  users,
  statuses,
  onCreateProject,
  onDeleteProject,
  onCreateSubProject,
  onDeleteSubProject,
  onCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
  getUserName
}) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createSubProjectOpen, setCreateSubProjectOpen] = useState(false);
  const [createTaskOpenForSubProjectId, setCreateTaskOpenForSubProjectId] = useState('');
  const [collapsedSubProjects, setCollapsedSubProjects] = useState({});

  const toggleSubProject = (id) => setCollapsedSubProjects(prev => ({ ...prev, [id]: !prev[id] }));

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newSubProjectName, setNewSubProjectName] = useState('');
  const [newSubProjectDescription, setNewSubProjectDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId('');
      return;
    }

    const hasSelectedProject = projects.some(p => String(p.Id) === selectedProjectId);
    if (!hasSelectedProject) {
      setSelectedProjectId(String(projects[0].Id));
    }
  }, [projects, selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find(p => String(p.Id) === selectedProjectId),
    [projects, selectedProjectId]
  );

  const subProjects = selectedProject?.SubProjects ?? [];
  const taskDialogSubProject = subProjects.find(sp => String(sp.Id) === createTaskOpenForSubProjectId);

  const handleCreateProjectClose = () => {
    setCreateProjectOpen(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  const handleCreateSubProjectClose = () => {
    setCreateSubProjectOpen(false);
    setNewSubProjectName('');
    setNewSubProjectDescription('');
  };

  const handleCreateTaskClose = () => {
    setCreateTaskOpenForSubProjectId('');
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssigneeId('');
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreateProject({ name: newProjectName, description: newProjectDescription });
    if (ok) handleCreateProjectClose();
  };

  const handleCreateSubProjectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    const ok = await onCreateSubProject(selectedProject.Id, {
      name: newSubProjectName,
      description: newSubProjectDescription,
    });
    if (ok) handleCreateSubProjectClose();
  };

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskDialogSubProject) return;

    const ok = await onCreateTask(taskDialogSubProject.Id, {
      title: newTaskTitle,
      description: newTaskDescription,
      assigneeId: newTaskAssigneeId,
    });
    if (ok) handleCreateTaskClose();
  };

  return (
    <Stack spacing={2.5}>
      <Card elevation={2}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
              <Typography variant="h6" fontWeight={700}>Widok projektu</Typography>
              <Button variant="contained" onClick={() => setCreateProjectOpen(true)} sx={{ ml: 'auto', flexShrink: 0 }}>
                Dodaj projekt
              </Button>
            </Stack>

            {projects.length === 0 ? (
              <Typography color="text.secondary">Brak projektow. Dodaj pierwszy projekt, aby rozpoczac prace.</Typography>
            ) : (
              <FormControl fullWidth>
                <InputLabel id="project-select-label">Projekt</InputLabel>
                <Select
                  labelId="project-select-label"
                  label="Projekt"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {projects.map(project => (
                    <MenuItem key={project.Id} value={String(project.Id)}>
                      {project.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </CardContent>
      </Card>

      {selectedProject && (
        <Card elevation={2}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                <Typography variant="h5" fontWeight={700}>{selectedProject.Name}</Typography>
                <Button variant="contained" onClick={() => setCreateSubProjectOpen(true)} sx={{ ml: 'auto', flexShrink: 0 }}>
                  Dodaj podprojekt
                </Button>
                <IconButton color="error" onClick={() => onDeleteProject(selectedProject.Id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <Typography color="text.secondary">{selectedProject.Description || 'Brak opisu projektu'}</Typography>
              <Chip
                color="primary"
                variant="outlined"
                label={`Podprojekty: ${subProjects.length}`}
                sx={{ alignSelf: 'flex-start' }}
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {selectedProject && subProjects.length === 0 && (
        <Typography color="text.secondary">Wybrany projekt nie ma jeszcze podprojektow.</Typography>
      )}

      {subProjects.map(subProject => {
        const tasks = subProject.Tasks ?? [];

        return (
          <Card key={subProject.Id} elevation={2}>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ width: '100%', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => toggleSubProject(subProject.Id)}
                >
                  <Typography variant="h6" fontWeight={700}>{subProject.Name}</Typography>
                  <Chip
                    color="secondary"
                    variant="outlined"
                    label={`Zadania: ${tasks.length}`}
                    sx={{ flexShrink: 0 }}
                    onClick={e => e.stopPropagation()}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ ml: 'auto', flexShrink: 0 }}
                    onClick={e => { e.stopPropagation(); setCreateTaskOpenForSubProjectId(String(subProject.Id)); }}
                  >
                    Dodaj zadanie
                  </Button>
                  <IconButton color="error" onClick={e => { e.stopPropagation(); onDeleteSubProject(subProject.Id); }}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton size="small" onClick={e => { e.stopPropagation(); toggleSubProject(subProject.Id); }}>
                    {collapsedSubProjects[subProject.Id] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                </Stack>

                <Collapse in={!collapsedSubProjects[subProject.Id]}>
                <Stack spacing={1.5}>
                <Typography color="text.secondary">{subProject.Description || 'Brak opisu'}</Typography>

                <KanbanBoard
                  statuses={statuses}
                  items={tasks}
                  getItemId={(task) => task.Id}
                  getItemStatus={(task) => task.Status}
                  onStatusChange={(id, status) => onUpdateTaskStatus(Number(id), status)}
                  renderItem={(task) => (
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle2" fontWeight={700}>{task.Title}</Typography>
                        <IconButton size="small" color="error" onClick={() => onDeleteTask(task.Id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{task.Description || 'Brak opisu'}</Typography>
                      <Typography variant="caption" color="text.secondary">Przypisany: {getUserName(task.AssigneeId)}</Typography>
                    </Stack>
                  )}
                />
                </Stack>
                </Collapse>
              </Stack>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={createProjectOpen} onClose={handleCreateProjectClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowy projekt</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleCreateProjectSubmit} spacing={2} sx={{ pt: 1 }}>
            <TextField
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              label="Nazwa projektu"
              required
              autoFocus
            />
            <TextField
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              label="Opis projektu"
              multiline
              minRows={3}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCreateProjectClose}>Anuluj</Button>
              <Button type="submit" variant="contained">Dodaj projekt</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={createSubProjectOpen} onClose={handleCreateSubProjectClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowy podprojekt</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleCreateSubProjectSubmit} spacing={2} sx={{ pt: 1 }}>
            <TextField
              value={newSubProjectName}
              onChange={(e) => setNewSubProjectName(e.target.value)}
              label="Nazwa podprojektu"
              required
              autoFocus
            />
            <TextField
              value={newSubProjectDescription}
              onChange={(e) => setNewSubProjectDescription(e.target.value)}
              label="Opis podprojektu"
              multiline
              minRows={3}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCreateSubProjectClose}>Anuluj</Button>
              <Button type="submit" variant="contained" disabled={!selectedProject}>Dodaj podprojekt</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(createTaskOpenForSubProjectId)} onClose={handleCreateTaskClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowe zadanie</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleCreateTaskSubmit} spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Podprojekt: {taskDialogSubProject?.Name ?? '-'}
            </Typography>
            <TextField
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              label="Tytul zadania"
              required
              autoFocus
            />
            <TextField
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              label="Opis zadania"
              multiline
              minRows={2}
            />
            <FormControl>
              <InputLabel id="task-assignee-label">Przypisana osoba</InputLabel>
              <Select
                labelId="task-assignee-label"
                label="Przypisana osoba"
                value={newTaskAssigneeId}
                onChange={(e) => setNewTaskAssigneeId(e.target.value)}
              >
                <MenuItem value="">Brak</MenuItem>
                {users.map(user => (
                  <MenuItem key={user.Id} value={String(user.Id)}>
                    {user.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCreateTaskClose}>Anuluj</Button>
              <Button type="submit" variant="contained" disabled={!taskDialogSubProject}>Dodaj zadanie</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
