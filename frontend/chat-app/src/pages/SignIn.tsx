import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Grid } from '@mui/material';
import '../styles/Signin.scss';
import { validateSignIn } from '../validators/Signin';

const SignIn = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // validation 
    const ValidationResult = validateSignIn({ identifier, password });
    if (ValidationResult.success) {
      console.log('Sign In:', { identifier, password });
    } else {
      // Display general error if present, otherwise concatenate field errors
      const errors = ValidationResult.errors;
      // Assuming errors is of type { general?: string; identifier?: string; password?: string }
      const errorMsg =
        (errors as { general?: string; identifier?: string; password?: string }).general ||
        [
          'identifier' in errors ? errors.identifier : undefined,
          'password' in errors ? errors.password : undefined
        ].filter(Boolean).join(' ') ||
        'Sign in failed';
      setError(errorMsg);
    }
  };

  const showCorrectIcon = () => {
    if (showPassword) {
      return <RemoveRedEyeIcon className='remove-eye-icon' onClick={() => setShowPassword(!showPassword)} />;
    } else {
      return <VisibilityOffIcon className='visibility-icon' onClick={() => setShowPassword(!showPassword)} />;
    }
  }

  return (
    <div className='background-image-signin'>
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid container className="SignInForm">
          <Grid item xs={12} className="form-container">
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
              Sign In to Chatscripte
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
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }} className='form'>
              <div className='input-container'>
                <MailIcon className='mail-icon' />
                <input type="text" placeholder="Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
              </div>
              <div className='input-container'>
                <LockIcon className='lock-icon' />
                {showCorrectIcon()}
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
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
    </div>
  );
};

export default SignIn;