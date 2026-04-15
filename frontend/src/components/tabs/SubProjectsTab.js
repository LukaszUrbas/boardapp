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

export default function SubProjectsTab({
  selectedProjectId,
  setSelectedProjectId,
  subProjectName,
  setSubProjectName,
  subProjectDescription,
  setSubProjectDescription,
  createSubProject,
  projects,
  subProjectFilterProjectId,
  setSubProjectFilterProjectId,
  filteredSubProjects,
  statuses,
  updateSubProjectStatus
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Nowy podprojekt</Typography>
            <Box component="form" onSubmit={createSubProject}>
              <Stack spacing={2}>
                <FormControl required>
                  <InputLabel id="create-subproject-project">Projekt</InputLabel>
                  <Select
                    labelId="create-subproject-project"
                    value={selectedProjectId}
                    label="Projekt"
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <MenuItem value="">Wybierz projekt</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.Id} value={String(project.Id)}>{project.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  value={subProjectName}
                  onChange={(e) => setSubProjectName(e.target.value)}
                  label="Nazwa podprojektu"
                  required
                />
                <TextField
                  value={subProjectDescription}
                  onChange={(e) => setSubProjectDescription(e.target.value)}
                  label="Opis podprojektu"
                  multiline
                  minRows={3}
                />
                <Button type="submit" variant="contained">Dodaj podprojekt</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card elevation={2}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Lista podprojektow</Typography>
              <FormControl>
                <InputLabel id="subproject-filter-project">Projekt</InputLabel>
                <Select
                  labelId="subproject-filter-project"
                  value={subProjectFilterProjectId}
                  label="Projekt"
                  onChange={(e) => setSubProjectFilterProjectId(e.target.value)}
                >
                  <MenuItem value="">Wybierz projekt</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.Id} value={String(project.Id)}>{project.Name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {!subProjectFilterProjectId ? (
                <Typography color="text.secondary">Najpierw wybierz projekt.</Typography>
              ) : filteredSubProjects.length === 0 ? (
                <Typography color="text.secondary">Brak podprojektow dla wybranego projektu.</Typography>
              ) : (
                <Stack spacing={1.5}>
                  {filteredSubProjects.map((subProject) => (
                    <Card key={subProject.Id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700}>{subProject.Name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {subProject.Description || 'Brak opisu'}
                            </Typography>
                          </Box>
                          <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel id={`subproject-status-${subProject.Id}`}>Status</InputLabel>
                            <Select
                              labelId={`subproject-status-${subProject.Id}`}
                              value={subProject.Status}
                              label="Status"
                              onChange={(e) => updateSubProjectStatus(subProject.Id, e.target.value)}
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
