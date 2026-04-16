import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
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
import DeleteIcon from '@mui/icons-material/Delete';
import KanbanBoard from '../common/KanbanBoard';

export default function SubProjectsTab({ projects, statuses, onCreateSubProject, onUpdateStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [formProjectId, setFormProjectId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const filteredSubProjects = projects.find(p => p.Id === Number(filterProjectId))?.SubProjects ?? [];

  const handleClose = () => {
    setOpen(false);
    setFormProjectId('');
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreateSubProject(Number(formProjectId), { name, description });
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
            <Typography variant="h6">Lista podprojektów</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>Dodaj</Button>
          </Stack>

          <FormControl>
            <InputLabel id="sp-filter-project">Filtruj wg projektu</InputLabel>
            <Select
              labelId="sp-filter-project"
              value={filterProjectId}
              label="Filtruj wg projektu"
              onChange={e => setFilterProjectId(e.target.value)}
            >
              <MenuItem value="">Wybierz projekt</MenuItem>
              {projects.map(p => (
                <MenuItem key={p.Id} value={String(p.Id)}>{p.Name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {!filterProjectId ? (
            <Typography color="text.secondary">Najpierw wybierz projekt.</Typography>
          ) : filteredSubProjects.length === 0 ? (
            <Typography color="text.secondary">Brak podprojektów dla wybranego projektu.</Typography>
          ) : (
            <KanbanBoard
              statuses={statuses}
              items={filteredSubProjects}
              getItemId={sp => sp.Id}
              getItemStatus={sp => sp.Status}
              onStatusChange={(id, status) => onUpdateStatus(Number(id), status)}
              renderItem={sp => (
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle2" fontWeight={700}>{sp.Name}</Typography>
                    <IconButton size="small" color="error" onClick={() => onDelete(sp.Id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">{sp.Description || 'Brak opisu'}</Typography>
                </Stack>
              )}
            />
          )}
        </Stack>
      </CardContent>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowy podprojekt</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ pt: 1 }}>
            <FormControl required>
              <InputLabel id="modal-sp-project">Projekt</InputLabel>
              <Select labelId="modal-sp-project" value={formProjectId} label="Projekt" onChange={e => setFormProjectId(e.target.value)}>
                <MenuItem value="">Wybierz projekt</MenuItem>
                {projects.map(p => (
                  <MenuItem key={p.Id} value={String(p.Id)}>{p.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField value={name} onChange={e => setName(e.target.value)} label="Nazwa podprojektu" required />
            <TextField value={description} onChange={e => setDescription(e.target.value)} label="Opis podprojektu" multiline minRows={3} />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>Anuluj</Button>
              <Button type="submit" variant="contained">Dodaj podprojekt</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
