import { useState } from 'react';
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
import StatusSelect from '../common/StatusSelect';

export default function TasksTab({ projects, users, statuses, onCreateTask, onUpdateStatus, onDelete, getUserName }) {
  const [open, setOpen] = useState(false);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterSubProjectId, setFilterSubProjectId] = useState('');
  const [formProjectId, setFormProjectId] = useState('');
  const [formSubProjectId, setFormSubProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const filterProject = projects.find(p => p.Id === Number(filterProjectId));
  const filteredTasks = filterProject?.SubProjects.find(sp => sp.Id === Number(filterSubProjectId))?.Tasks ?? [];
  const formProject = projects.find(p => p.Id === Number(formProjectId));

  const handleClose = () => {
    setOpen(false);
    setFormProjectId('');
    setFormSubProjectId('');
    setTitle('');
    setDescription('');
    setAssigneeId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreateTask(Number(formSubProjectId), { title, description, assigneeId });
    if (ok) handleClose();
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            <Typography variant="h6">Lista zadań</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>Dodaj</Button>
          </Stack>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="task-filter-project">Projekt</InputLabel>
                <Select
                  labelId="task-filter-project"
                  value={filterProjectId}
                  label="Projekt"
                  onChange={e => { setFilterProjectId(e.target.value); setFilterSubProjectId(''); }}
                >
                  <MenuItem value="">Wybierz projekt</MenuItem>
                  {projects.map(p => (
                    <MenuItem key={p.Id} value={String(p.Id)}>{p.Name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth disabled={!filterProjectId}>
                <InputLabel id="task-filter-subproject">Podprojekt</InputLabel>
                <Select
                  labelId="task-filter-subproject"
                  value={filterSubProjectId}
                  label="Podprojekt"
                  onChange={e => setFilterSubProjectId(e.target.value)}
                >
                  <MenuItem value="">Wybierz podprojekt</MenuItem>
                  {filterProject?.SubProjects.map(sp => (
                    <MenuItem key={sp.Id} value={String(sp.Id)}>{sp.Name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {!filterProjectId ? (
            <Typography color="text.secondary">Najpierw wybierz projekt.</Typography>
          ) : !filterSubProjectId ? (
            <Typography color="text.secondary">Wybierz podprojekt, aby zobaczyć zadania.</Typography>
          ) : filteredTasks.length === 0 ? (
            <Typography color="text.secondary">Brak zadań dla wybranego podprojektu.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {filteredTasks.map(task => (
                <Card key={task.Id} variant="outlined">
                  <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={700}>{task.Title}</Typography>
                        <Typography variant="body2" color="text.secondary">{task.Description || 'Brak opisu'}</Typography>
                        <Typography variant="caption" color="text.secondary">Przypisany: {getUserName(task.AssigneeId)}</Typography>
                      </Box>
                      <StatusSelect value={task.Status} onChange={e => onUpdateStatus(task.Id, e.target.value)} statuses={statuses} />
                      <Button variant="outlined" color="error" onClick={() => onDelete(task.Id)}>Usuń</Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowe zadanie</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ pt: 1 }}>
            <FormControl required>
              <InputLabel id="modal-task-project">Projekt</InputLabel>
              <Select
                labelId="modal-task-project"
                value={formProjectId}
                label="Projekt"
                onChange={e => { setFormProjectId(e.target.value); setFormSubProjectId(''); }}
              >
                <MenuItem value="">Wybierz projekt</MenuItem>
                {projects.map(p => (
                  <MenuItem key={p.Id} value={String(p.Id)}>{p.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <InputLabel id="modal-task-subproject">Podprojekt</InputLabel>
              <Select
                labelId="modal-task-subproject"
                value={formSubProjectId}
                label="Podprojekt"
                onChange={e => setFormSubProjectId(e.target.value)}
                disabled={!formProjectId}
              >
                <MenuItem value="">Wybierz podprojekt</MenuItem>
                {formProject?.SubProjects.map(sp => (
                  <MenuItem key={sp.Id} value={String(sp.Id)}>{sp.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField value={title} onChange={e => setTitle(e.target.value)} label="Tytuł zadania" required autoFocus />
            <TextField value={description} onChange={e => setDescription(e.target.value)} label="Opis zadania" multiline minRows={2} />

            <FormControl>
              <InputLabel id="modal-task-assignee">Przypisana osoba</InputLabel>
              <Select labelId="modal-task-assignee" value={assigneeId} label="Przypisana osoba" onChange={e => setAssigneeId(e.target.value)}>
                <MenuItem value="">Brak</MenuItem>
                {users.map(u => (
                  <MenuItem key={u.Id} value={String(u.Id)}>{u.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>Anuluj</Button>
              <Button type="submit" variant="contained">Dodaj zadanie</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
