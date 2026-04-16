import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import StatusSelect from '../common/StatusSelect';

export default function ProjectsTab({ projects, statuses, onCreateProject, onUpdateStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setOpen(false);
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreateProject({ name, description });
    if (ok) handleClose();
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">Lista projektów</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Dodaj</Button>
        </Stack>

        {projects.length === 0 ? (
          <Typography color="text.secondary">Brak projektów.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {projects.map(project => (
              <Card key={project.Id} variant="outlined">
                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={700}>{project.Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.Description || 'Brak opisu'}
                      </Typography>
                    </Box>
                    <StatusSelect
                      value={project.Status}
                      onChange={e => onUpdateStatus(project.Id, e.target.value)}
                      statuses={statuses}
                    />
                    <Button variant="outlined" color="error" onClick={() => onDelete(project.Id)}>
                      Usuń
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nowy projekt</DialogTitle>
        <DialogContent>
          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ pt: 1 }}>
            <TextField value={name} onChange={e => setName(e.target.value)} label="Nazwa projektu" required autoFocus />
            <TextField value={description} onChange={e => setDescription(e.target.value)} label="Opis projektu" multiline minRows={3} />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>Anuluj</Button>
              <Button type="submit" variant="contained">Dodaj projekt</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
