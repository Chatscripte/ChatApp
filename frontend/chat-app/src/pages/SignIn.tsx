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
import { setCookie } from '../lib/helper';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ general?: string; identifier?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // validation 
    const ValidationResult = validateSignIn({ identifier, password });
    if (ValidationResult.success) {
      try {
        const result = await fetch(`${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ identifier, password }),
        });
        if (result.status === 400) {
          setError({ general: 'Incorrect Password' });
        }
        const { data } = await result.json();
        setCookie('accessToken', data.accessToken, import.meta.env.VITE_ACCESS_TOKEN_EXPIRES_IN_SECONDS);
        navigate('/chat');
      } catch (error) {
        console.error('Error during sign in:', error);
      }
    } else {
      const fieldErrors = ValidationResult.errors;
      const formattedErrors: { identifier?: string; password?: string; general?: string } = {};
      if ('identifier' in fieldErrors && fieldErrors.identifier) {
        formattedErrors.identifier = Array.isArray(fieldErrors.identifier) ? fieldErrors.identifier[0] : fieldErrors.identifier;
      }
      if ('password' in fieldErrors && fieldErrors.password) {
        formattedErrors.password = Array.isArray(fieldErrors.password) ? fieldErrors.password[0] : fieldErrors.password;
      }
      if ('general' in fieldErrors && fieldErrors.general) {
        formattedErrors.general = fieldErrors.general;
      }
      setError(formattedErrors);
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
      <Container maxWidth="sm" sx={{ height: '100vh', alignItems: 'center' }}>
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
            {/* General error message */}
            {error.general && (
              <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
                {error.general}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }} className='form'>
              <div className='input-container'>
                <MailIcon className='mail-icon' />
                <input type="text" placeholder="Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                {error.identifier && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {error.identifier}
                  </Typography>
                )}
              </div>
              <div className='input-container'>
                <LockIcon className='lock-icon' />
                {showCorrectIcon()}
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error.password && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {error.password}
                  </Typography>
                )}
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