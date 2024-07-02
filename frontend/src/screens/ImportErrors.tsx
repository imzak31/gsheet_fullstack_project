import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getImportErrors } from "../endpoints/endpoint";
import { ImportErrorResponse } from "../structs/importErrorStruct";

export default function ImportErrors() {
  const [page, setPage] = useState(1);

  const { data, isError, isLoading, error } = useQuery<ImportErrorResponse, Error>({
    queryKey: ['importErrors', page],
    queryFn: () => getImportErrors(page),
  });

  useEffect(() => {
    if (isError) {
      console.error("Error loading data:", error);
    }
    if (data) {
      console.log("Data loaded successfully:", data);
    }
  }, [isError, data, error]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h4">Import Errors</Typography>
      </Box>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography>Error loading data</Typography>}
      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Import ID</TableCell>
                <TableCell>Error Messages</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>{error.attributes.id}</TableCell>
                  <TableCell>{error.attributes.import_id}</TableCell>
                  <TableCell>{error.attributes.error_messages}</TableCell>
                  <TableCell>{error.attributes.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <Typography mx={2}>{page}</Typography>
        <Button onClick={() => setPage((prev) => prev + 1)} disabled={!data || !data.meta || !data.meta.next_page}>
          Next
        </Button>
      </Box>
    </Container>
  );
}
