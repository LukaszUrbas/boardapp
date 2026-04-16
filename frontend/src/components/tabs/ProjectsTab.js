import { useState } from 'react';
import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KanbanBoard from '../common/KanbanBoard';

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Projekty</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Dodaj projekt</Button>
        </Stack>

        {projects.length === 0 ? (
          <Typography color="text.secondary">Brak projektów.</Typography>
        ) : (
          <KanbanBoard
            statuses={statuses}
            items={projects}
            getItemId={p => p.Id}
            getItemStatus={p => p.Status}
            onStatusChange={(id, status) => onUpdateStatus(Number(id), status)}
            renderItem={p => (
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="subtitle2" fontWeight={700}>{p.Name}</Typography>
                  <IconButton size="small" color="error" onClick={() => onDelete(p.Id)}><DeleteIcon fontSize="small" /></IconButton>
                </Stack>
                <Typography variant="caption" color="text.secondary">{p.Description || 'Brak opisu'}</Typography>
              </Stack>
            )}
          />
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
