import React, { useState } from 'react';
import { Container, Button, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, TextField } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVacationSheets, createVacationSheet, updateVacationSheet, deleteVacationSheet } from '../endpoints/endpoint';
import Modal from '../components/Modal';
import VacationSheetForm from "../forms/VacationSheetForm";
import { VacationSheet } from "../structs/vacationSheetStruct";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { extractErrors } from '../utils/api/errors';

export default function VacationSheets() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<VacationSheet | null>(null);
  const [showMode, setShowMode] = useState(false); // To differentiate between show and edit mode
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    leader: '',
    state: '',
    from_date: '',
    until_date: '',
    vacation_kind: '',
    reason: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters); // State to hold applied filters
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['vacationSheets', page, appliedFilters],
    queryFn: () => getVacationSheets(page, appliedFilters),
  });

  const createMutation = useMutation<VacationSheet, Error, Omit<VacationSheet, 'id' | 'vacation_days_taken'>>({
    mutationFn: createVacationSheet,
    onSuccess: () => {
      setSnackbarMessage('Vacation sheet created successfully');
      setSnackbarOpen(true);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['vacationSheets'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const errors = extractErrors(error.response.data);
        console.log('Create Mutation Errors:', errors); // Debugging log
        setFormErrors(errors);
      } else {
        setSnackbarMessage('Failed to create vacation sheet');
        setSnackbarOpen(true);
      }
    }
  });

  const updateMutation = useMutation<VacationSheet, Error, VacationSheet>({
    mutationFn: updateVacationSheet,
    onSuccess: () => {
      setSnackbarMessage('Vacation sheet updated successfully');
      setSnackbarOpen(true);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['vacationSheets'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const errors = extractErrors(error.response.data);
        console.log('Update Mutation Errors:', errors); // Debugging log
        setFormErrors(errors);
      } else {
        setSnackbarMessage('Failed to update vacation sheet');
        setSnackbarOpen(true);
      }
    }
  });

  const deleteMutation = useMutation<Response, Error, number>({
    mutationFn: deleteVacationSheet,
    onSuccess: () => {
      setSnackbarMessage('Vacation sheet deleted successfully');
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ['vacationSheets'] });
    },
    onError: () => {
      setSnackbarMessage('Failed to delete vacation sheet');
      setSnackbarOpen(true);
    },
  });

  const handleFormSubmit = (data: Omit<VacationSheet, 'id' | 'vacation_days_taken'>) => {
    setFormErrors({}); // Clear previous errors
    if (selectedSheet) {
      const updateData: VacationSheet = {
        ...data,
        id: selectedSheet.id,
        vacation_days_taken: selectedSheet.vacation_days_taken, // Add the required property
      };
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(data);
    }
  };

  const openModal = (sheet?: VacationSheet, show = false) => {
    setSelectedSheet(sheet || null);
    setShowMode(show);
    setModalOpen(true);
    setFormErrors({}); // Clear errors when opening modal
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    queryClient.invalidateQueries({ queryKey: ['vacationSheets'] });
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h4">Vacation Sheets</Typography>
        <Button variant="contained" color="primary" onClick={() => openModal()}>
          Create New
        </Button>
      </Box>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography>Error loading data</Typography>}
      {data && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" color="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
          </Box>
          <TableContainer component={Paper} style={{ width: '100%' }}>
            <Table style={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TextField
                      name="name"
                      label="Name"
                      value={filters.name}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="email"
                      label="Email"
                      value={filters.email}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="leader"
                      label="Leader"
                      value={filters.leader}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="from_date"
                      label="From Date"
                      type="date"
                      value={filters.from_date}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="until_date"
                      label="Until Date"
                      type="date"
                      value={filters.until_date}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="vacation_kind"
                      label="Vacation Kind"
                      value={filters.vacation_kind}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="reason"
                      label="Reason"
                      value={filters.reason}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="state"
                      label="State"
                      value={filters.state}
                      onChange={handleFilterChange}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.vacation_sheets.map(sheet => (
                  <TableRow key={sheet.id}>
                    <TableCell>{sheet.name}</TableCell>
                    <TableCell>{sheet.email}</TableCell>
                    <TableCell>{sheet.leader}</TableCell>
                    <TableCell>{sheet.from_date}</TableCell>
                    <TableCell>{sheet.until_date}</TableCell>
                    <TableCell>{sheet.vacation_kind}</TableCell>
                    <TableCell>{sheet.reason}</TableCell>
                    <TableCell>{sheet.state}</TableCell>
                    <TableCell>{sheet.vacation_days_taken}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openModal(sheet)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => openModal(sheet, true)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(sheet.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <Typography mx={2}>{page}</Typography>
        <Button onClick={() => setPage(prev => prev + 1)} disabled={!data || data.vacation_sheets.length < 10}>
          Next
        </Button>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={showMode ? 'View Vacation Sheet' : selectedSheet ? 'Edit Vacation Sheet' : 'Create Vacation Sheet'}>
        <VacationSheetForm
          initialData={selectedSheet || undefined}
          onSubmit={handleFormSubmit}
          submitText={selectedSheet ? 'Update' : 'Create'}
          onDelete={selectedSheet ? () => handleDelete(selectedSheet.id) : undefined}
          isViewMode={showMode}
          errors={formErrors}
        />
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
}
