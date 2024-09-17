import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  Skeleton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import { useCookies } from 'react-cookie';
import { useTheme } from './Themecontext';
import { decodeToken } from '../utils/decode';

const ErrorMessage = ({ children }) => (
  <Typography variant="caption" color="error">
    <ErrorIcon style={{ marginRight: "5px", fontSize: '15px' }} />
    {children}
  </Typography>
);

export default function Login() {
  const { mode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['accessToken']);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    if (cookies.accessToken) {
      try {
        const decodedToken = decodeToken(cookies.accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          navigate('/profile');
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [cookies, navigate]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/users/signin`, values);
      if (response.data.statuscode === 200 && response.data.message === "Login SuccessFully") {
        toast.success(response.data.message);
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);
        setCookie('accessToken', response.data.accessToken, { path: '/', expires, sameSite: 'strict', secure: true });
        navigate('/profile');
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 404 && error.response.data.message === "Email is Not Verify") {
          return toast.error(error.response.data.message);
        } else if (error.response.status === 404 && error.response.data.message === "User does not exist") {
          return toast.error(error.response.data.message);
        } else if (error.response.status === 401 && error.response.data.message === "Invalid User credentials") {
          return toast.error(error.response.data.message);
        } else {
          return toast.error("An unexpected error occurred.");
        }
      } else {
        return toast.error("Network error or server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Grid container component="main" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} sx={{ borderRadius: 4 }}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="60%" height={32} sx={{ my: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ my: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ my: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 3, mb: 2 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mt: 2 }} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container component="main" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} sx={{ borderRadius: 4 }}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Field
                      margin="normal"
                      as={TextField}
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={errors.email && touched.email}
                      helperText={errors.email && touched.email ? <ErrorMessage children={errors.email} /> : null}
                    />
                    <Field
                      margin="normal"
                      as={TextField}
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      error={errors.password && touched.password}
                      helperText={errors.password && touched.password ? <ErrorMessage children={errors.password} /> : null}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {loading ? (
                      <LoadingButton fullWidth sx={{ mt: 3, mb: 2 }} loading variant="contained">
                        Submit
                      </LoadingButton>
                    ) : (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                      >
                        Sign In
                      </Button>
                    )}
                    <Grid container>
                      <Grid item>
                        <Link to="/signup" style={{ color: mode === 'dark' ? 'white' : '' }} variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
