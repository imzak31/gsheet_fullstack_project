// src/screens/ImportSheet.tsx
import React, { useState } from 'react';
import { Container, Box, Typography, Button, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { importFile } from "../endpoints/endpoint";

const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const FileInput = styled('input')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export default function ImportSheet() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      const response = await importFile(file);
      setSuccess('File uploaded successfully');
      setError(null);
      console.log(response);
    } catch (err) {
      setError('Failed to upload file');
      setSuccess(null);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <FormContainer>
        <Typography component="h1" variant="h5">
          Import a Sheet
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FileInput
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Upload
          </Button>
        </Box>
      </FormContainer>
    </Container>
  );
}
