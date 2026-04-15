import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

export default function TasksTab({
  selectedProjectId,
  setSelectedProjectId,
  selectedSubProjectId,
  setSelectedSubProjectId,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskAssigneeId,
  setTaskAssigneeId,
  createTask,
  projects,
  selectedProject,
  users,
  taskFilterProjectId,
  setTaskFilterProjectId,
  taskFilterSubProjectId,
  setTaskFilterSubProjectId,
  taskFilterProject,
  filteredTasks,
  statuses,
  getUserName,
  updateTaskStatus
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Nowe zadanie</Typography>
            <Box component="form" onSubmit={createTask}>
              <Stack spacing={2}>
                <FormControl required>
                  <InputLabel id="create-task-project">Projekt</InputLabel>
                  <Select
                    labelId="create-task-project"
                    value={selectedProjectId}
                    label="Projekt"
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      setSelectedSubProjectId('');
                    }}
                  >
                    <MenuItem value="">Wybierz projekt</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.Id} value={String(project.Id)}>{project.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl required>
                  <InputLabel id="create-task-subproject">Podprojekt</InputLabel>
                  <Select
                    labelId="create-task-subproject"
                    value={selectedSubProjectId}
                    label="Podprojekt"
                    onChange={(e) => setSelectedSubProjectId(e.target.value)}
                  >
                    <MenuItem value="">Wybierz podprojekt</MenuItem>
                    {selectedProject?.SubProjects.map((subProject) => (
                      <MenuItem key={subProject.Id} value={String(subProject.Id)}>{subProject.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  label="Tytul zadania"
                  required
                />
                <TextField
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  label="Opis zadania"
                  multiline
                  minRows={2}
                />

                <FormControl>
                  <InputLabel id="create-task-assignee">Przypisana osoba</InputLabel>
                  <Select
                    labelId="create-task-assignee"
                    value={taskAssigneeId}
                    label="Przypisana osoba"
                    onChange={(e) => setTaskAssigneeId(e.target.value)}
                  >
                    <MenuItem value="">Brak</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.Id} value={String(user.Id)}>{user.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button type="submit" variant="contained">Dodaj zadanie</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card elevation={2}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Lista zadan</Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="task-filter-project">Projekt</InputLabel>
                    <Select
                      labelId="task-filter-project"
                      value={taskFilterProjectId}
                      label="Projekt"
                      onChange={(e) => setTaskFilterProjectId(e.target.value)}
                    >
                      <MenuItem value="">Wybierz projekt</MenuItem>
                      {projects.map((project) => (
                        <MenuItem key={project.Id} value={String(project.Id)}>{project.Name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="task-filter-subproject">Podprojekt</InputLabel>
                    <Select
                      labelId="task-filter-subproject"
                      value={taskFilterSubProjectId}
                      label="Podprojekt"
                      onChange={(e) => setTaskFilterSubProjectId(e.target.value)}
                      disabled={!taskFilterProjectId || (taskFilterProject?.SubProjects.length || 0) === 0}
                    >
                      <MenuItem value="">Wybierz podprojekt</MenuItem>
                      {taskFilterProject?.SubProjects.map((subProject) => (
                        <MenuItem key={subProject.Id} value={String(subProject.Id)}>{subProject.Name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {!taskFilterProjectId ? (
                <Typography color="text.secondary">Najpierw wybierz projekt.</Typography>
              ) : !taskFilterSubProjectId ? (
                <Typography color="text.secondary">Wybierz podprojekt aby zobaczyc zadania.</Typography>
              ) : filteredTasks.length === 0 ? (
                <Typography color="text.secondary">Brak zadan dla wybranego podprojektu.</Typography>
              ) : (
                <Stack spacing={1.5}>
                  {filteredTasks.map((task) => (
                    <Card key={task.Id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700}>{task.Title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.Description || 'Brak opisu'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Przypisany: {getUserName(task.AssigneeId)}
                            </Typography>
                          </Box>
                          <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel id={`task-status-${task.Id}`}>Status</InputLabel>
                            <Select
                              labelId={`task-status-${task.Id}`}
                              value={task.Status}
                              label="Status"
                              onChange={(e) => updateTaskStatus(task.Id, e.target.value)}
                            >
                              {statuses.map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
