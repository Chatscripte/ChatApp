import  { useState } from 'react';
import reactLogo from '../assets/react.svg';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Grid } from '@mui/material';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    console.log('Sign In:', { email, password });
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container className="SignInForm">
        <Grid item xs={12}>
          <div className='wrapper-image'>
            <img
            src={reactLogo}
            alt="ChatVibe Logo"
          />
          </div>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: '#E0E0E0', fontWeight: 600, mb: 3 }}
          >
            Sign In to ChatVibe
          </Typography>
          {error && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#E0E0E0' },
                  '&:hover fieldset': { borderColor: '#E0E0E0' },
                  '&.Mui-focused fieldset': { borderColor: '#385df2ff' },
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#E0E0E0',
                  transform: 'translate(14px, -9px) scale(0.75)',
                  backgroundColor: '#121212',
                  padding: '0 4px',
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#385df2ff' },
                '& .MuiInputBase-input': { color: '#E0E0E0' },
              }}
              InputLabelProps={{
                shrink: true, // Ensures label is always visible
              }}
              InputProps={{
                style: { fontFamily: 'Inter, sans-serif' },
              }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#E0E0E0' },
                  '&:hover fieldset': { borderColor: '#E0E0E0' },
                  '&.Mui-focused fieldset': { borderColor: '#385df2ff' },
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#E0E0E0',
                  transform: 'translate(14px, -9px) scale(0.75)',
                  backgroundColor: '#121212',
                  padding: '0 4px',
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#385df2ff' },
                '& .MuiInputBase-input': { color: '#E0E0E0' },
              }}
              InputLabelProps={{
                shrink: true, // Ensures label is always visible
              }}
              InputProps={{
                style: { fontFamily: 'Inter, sans-serif' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #6AB0FF)',
                color: '#E0E0E0',
                py: 1.5,
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3A80D2, #5AA0EF)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;