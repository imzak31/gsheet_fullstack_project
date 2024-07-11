import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, List, ListItem, Paper, InputBase } from '@mui/material';
import { VacationSheet } from '../structs/vacationSheetStruct';
import { getCurrentUserAndUsersList } from "../endpoints/endpoint";
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../structs/currentUserResponseStruct';

interface VacationSheetFormProps {
    initialData?: Omit<VacationSheet, 'id' | 'vacation_days_taken'> | null;
    onSubmit: (data: Omit<VacationSheet, 'id' | 'vacation_days_taken'> & { user_id?: number }) => void;
    submitText: string;
    onDelete?: () => void;
    isViewMode?: boolean;
    errors?: Record<string, string>;
}

const VacationSheetForm: React.FC<VacationSheetFormProps> = ({ initialData, onSubmit, submitText, onDelete, isViewMode, errors }) => {
    const [formData, setFormData] = useState<Omit<VacationSheet, 'id' | 'vacation_days_taken'> & { user_id?: number }>(initialData || {
        from_date: '',
        until_date: '',
        vacation_kind: '',
        reason: '',
        state: '',
        created_at: '',
        updated_at: '',
        employee: '',
        employee_email: '',
        employee_leader: '',
    });

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchInput, setSearchInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            const fetchUsers = async () => {
                try {
                    const result = await getCurrentUserAndUsersList();
                    if (Array.isArray(result)) {
                        setUsers(result as User[]);
                        setFilteredUsers(result as User[]);
                    }
                } catch (err) {
                    console.error('Failed to fetch users', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [initialData]);

    useEffect(() => {
        if (searchInput) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchInput, users]);

    const handleUserChange = (userId: number) => {
        const user = users.find(user => user.id === userId) || null;
        setSelectedUser(user);

        if (user) {
            setFormData({
                ...formData,
                user_id: user.id,
                employee: user.name,
                employee_email: user.email,
                employee_leader: user.leader,
            });
            setDropdownOpen(false); // Close the dropdown after selection
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {!initialData && !selectedUser && (
                <>
                    <Typography variant="h6">Select Employee</Typography>
                    <Button fullWidth onClick={toggleDropdown}>
                        {dropdownOpen ? 'Close Employee List' : 'Open Employee List'}
                    </Button>
                    {dropdownOpen && (
                        <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                            <List>
                                <ListItem>
                                    <InputBase
                                        placeholder="Search Employee"
                                        value={searchInput}
                                        onChange={handleSearchChange}
                                        fullWidth
                                    />
                                </ListItem>
                                {filteredUsers.map(user => (
                                    <ListItem button key={user.id} onClick={() => handleUserChange(user.id)}>
                                        {user.name} ({user.email})
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </>
            )}
            {(initialData || selectedUser) && (
                <>
                    <Typography variant="h6">Employee Information</Typography>
                    <TextField
                        label="Employee Name"
                        name="employee"
                        value={formData.employee}
                        fullWidth
                        margin="normal"
                        disabled
                        error={Boolean(errors?.employee)}
                        helperText={errors?.employee}
                    />
                    <TextField
                        label="Employee Email"
                        name="employee_email"
                        value={formData.employee_email}
                        fullWidth
                        margin="normal"
                        disabled
                        error={Boolean(errors?.employee_email)}
                        helperText={errors?.employee_email}
                    />
                    <TextField
                        label="Employee Leader"
                        name="employee_leader"
                        value={formData.employee_leader}
                        fullWidth
                        margin="normal"
                        disabled
                        error={Boolean(errors?.employee_leader)}
                        helperText={errors?.employee_leader}
                    />
                    <Typography variant="h6" mt={2}>Vacation Information</Typography>
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
                </>
            )}
        </Box>
    );
};

export default VacationSheetForm;
