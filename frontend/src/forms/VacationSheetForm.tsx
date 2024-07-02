import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { VacationSheet } from '../structs/vacationSheetStruct';
import DeleteIcon from '@mui/icons-material/Delete';

interface VacationSheetFormProps {
  initialData?: Omit<VacationSheet, 'vacation_days_taken'> | null;
  onSubmit: (data: Omit<VacationSheet, 'id' | 'vacation_days_taken'>) => void;
  submitText: string;
  onDelete?: () => void;
  isViewMode?: boolean;
  errors?: Record<string, string>;
}

const VacationSheetForm: React.FC<VacationSheetFormProps> = ({ initialData, onSubmit, submitText, onDelete, isViewMode, errors }) => {
  const [formData, setFormData] = useState<Omit<VacationSheet, 'id' | 'vacation_days_taken'>>(initialData || {
    external_id: 0,
    name: '',
    email: '',
    leader: '',
    from_date: '',
    until_date: '',
    vacation_kind: '',
    reason: '',
    state: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="External ID"
        name="external_id"
        value={formData.external_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.external_id)}
        helperText={errors?.external_id}
      />
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.name)}
        helperText={errors?.name}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.email)}
        helperText={errors?.email}
      />
      <TextField
        label="Leader"
        name="leader"
        value={formData.leader}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.leader)}
        helperText={errors?.leader}
      />
      <TextField
        label="From Date"
        name="from_date"
        type="date"
        value={formData.from_date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        disabled={isViewMode}
        error={Boolean(errors?.from_date)}
        helperText={errors?.from_date}
      />
      <TextField
        label="Until Date"
        name="until_date"
        type="date"
        value={formData.until_date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        disabled={isViewMode}
        error={Boolean(errors?.until_date)}
        helperText={errors?.until_date}
      />
      <TextField
        label="Vacation Kind"
        name="vacation_kind"
        value={formData.vacation_kind}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.vacation_kind)}
        helperText={errors?.vacation_kind}
      />
      <TextField
        label="Reason"
        name="reason"
        value={formData.reason || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.reason)}
        helperText={errors?.reason}
      />
      <TextField
        label="State"
        name="state"
        value={formData.state || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isViewMode}
        error={Boolean(errors?.state)}
        helperText={errors?.state}
      />
      {!isViewMode && (
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {submitText}
        </Button>
      )}
      {onDelete && !isViewMode && (
        <Button onClick={onDelete} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
          <DeleteIcon /> Delete
        </Button>
      )}
    </Box>
  );
};

export default VacationSheetForm;


