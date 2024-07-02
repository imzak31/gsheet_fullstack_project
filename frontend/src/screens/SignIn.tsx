// src/screens/SignIn.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Link } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { routePaths } from '../routes/routePaths';

export default function SignIn() {
  const { signIn, signInMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signIn({ user: { email, password } });
      setError(null); // Reset error if successful
    } catch (err) {
      setError('Login details are incorrect');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {signInMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{signInMutation.error.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Not signed up? <Link href={routePaths.signUp}>Sign Up here</Link>
        </Typography>
      </Box>
    </Container>
  );
}
