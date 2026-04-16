import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

const COLUMN_META = {
  New:        { label: 'Nowe',        color: '#1976d2', bg: '#e3f2fd' },
  InProgress: { label: 'W toku',      color: '#f57c00', bg: '#fff3e0' },
  OnHold:     { label: 'Wstrzymane',  color: '#616161', bg: '#f5f5f5' },
  Finished:   { label: 'Zakończone',  color: '#388e3c', bg: '#e8f5e9' },
};

/**
 * KanbanBoard
 * Props:
 *   statuses       - string[]          column order
 *   items          - object[]          all items
 *   getItemId      - (item) => string  unique draggable id
 *   getItemStatus  - (item) => string  current status of item
 *   onStatusChange - (itemId, newStatus) => void
 *   renderItem     - (item) => ReactNode  card content (without dnd chrome)
 */
export default function KanbanBoard({ statuses, items, getItemId, getItemStatus, onStatusChange, renderItem }) {
  const columns = Object.fromEntries(statuses.map(s => [s, items.filter(i => getItemStatus(i) === s)]));

  const handleDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${statuses.length}, minmax(220px, 1fr))`,
          gap: 2,
          overflowX: 'auto',
          pb: 1,
        }}
      >
        {statuses.map(status => {
          const meta = COLUMN_META[status] ?? { label: status, color: '#555', bg: '#fafafa' };
          const col = columns[status];

          return (
            <Box key={status}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mb: 1.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: meta.bg,
                  borderBottom: `3px solid ${meta.color}`,
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: meta.color, flex: 1 }}>
                  {meta.label}
                </Typography>
                <Chip label={col.length} size="small" sx={{ backgroundColor: meta.color, color: '#fff', fontWeight: 700 }} />
              </Stack>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: 120,
                      borderRadius: 2,
                      p: 1,
                      backgroundColor: snapshot.isDraggingOver ? meta.bg : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {col.map((item, index) => {
                      const id = String(getItemId(item));
                      return (
                        <Draggable key={id} draggableId={id} index={index}>
                          {(prov, snap) => (
                            <Paper
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              elevation={snap.isDragging ? 6 : 1}
                              sx={{
                                mb: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                cursor: 'grab',
                                opacity: snap.isDragging ? 0.9 : 1,
                                outline: snap.isDragging ? `2px solid ${meta.color}` : 'none',
                                userSelect: 'none',
                              }}
                            >
                              {renderItem(item)}
                            </Paper>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          );
        })}
      </Box>
    </DragDropContext>
  );
}
