import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

export default function ProjectsTab({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  createProject,
  projects,
  statuses,
  updateProjectStatus,
  deleteProject
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleClose = () => {
    setIsCreateOpen(false);
    setProjectName('');
    setProjectDescription('');
  };

  const handleCreateProject = async (e) => {
    const wasCreated = await createProject(e);
    if (wasCreated) {
      setIsCreateOpen(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Card elevation={2}>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6">Lista projektow</Typography>
              <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
                Dodaj
              </Button>
            </Stack>
            {projects.length === 0 ? (
              <Typography color="text.secondary">Brak projektow.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {projects.map((project) => (
                  <Card key={project.Id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>{project.Name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.Description || 'Brak opisu'}
                          </Typography>
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <InputLabel id={`project-status-${project.Id}`}>Status</InputLabel>
                          <Select
                            labelId={`project-status-${project.Id}`}
                            value={project.Status}
                            label="Status"
                            onChange={(e) => updateProjectStatus(project.Id, e.target.value)}
                          >
                            {statuses.map((status) => (
                              <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => deleteProject(project.Id)}
                        >
                          Usun
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={isCreateOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowy projekt</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleCreateProject} spacing={2} sx={{ pt: 1 }}>
            <TextField
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              label="Nazwa projektu"
              required
              autoFocus
            />
            <TextField
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              label="Opis projektu"
              multiline
              minRows={3}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>
                Anuluj
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Dodaj projekt
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
