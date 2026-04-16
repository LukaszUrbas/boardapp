import { MenuItem, Select } from '@mui/material';

export default function StatusSelect({ value, onChange, statuses }) {
  return (
    <Select
      size="small"
      value={value ?? ''}
      onChange={onChange}
      sx={{ minWidth: 140 }}
    >
      {statuses.map(s => (
        <MenuItem key={s} value={s}>{s}</MenuItem>
      ))}
    </Select>
  );
}
