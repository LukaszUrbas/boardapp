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

export default function ProjectsTab({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  createProject,
  projects,
  statuses,
  updateProjectStatus
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Nowy projekt</Typography>
            <Box component="form" onSubmit={createProject}>
              <Stack spacing={2}>
                <TextField
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  label="Nazwa projektu"
                  required
                />
                <TextField
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  label="Opis projektu"
                  multiline
                  minRows={3}
                />
                <Button type="submit" variant="contained" color="primary">Dodaj projekt</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Lista projektow</Typography>
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
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
