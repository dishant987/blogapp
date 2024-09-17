import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from './Themecontext';

const ErrorMessage = ({ children }) => (
  <Typography variant="caption" color="error">
    <ErrorIcon style={{ marginRight: '5px', fontSize: '15px' }} />
    {children}
  </Typography>
);

export default function SignUp() {
  const { mode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const SignupSchema = Yup.object().shape({
    username: Yup.string().min(4, 'Too Short!').max(20, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'Too Short')
      .max(40, 'Too Long')
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+]).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()-_=+).'
      ),
    gender: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/users/signup`, values);
      if (response.status === 201 && response.data.message === 'Email sent successfully. Verify your email for login.') {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Invalid email format') {
        toast.error('Please provide a valid email address.');
      } else if (error.response && error.response.status === 500 && error.response.data.message === 'Failed to send verification email. Please try again later.') {
        toast.error('Failed to send verification email. Please try again later.');
      } else if (error.response && error.response.status === 409 && error.response.data.message === 'User with email or username already exists') {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong, try again later.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>

      <Container component="main" maxWidth="sm" sx={{ height: '99vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
        <Grid item xs={12} sm={8} md={6} paddingX={5} paddingBottom={5} component={Paper} elevation={6} sx={{ borderRadius: 4 }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Formik
              initialValues={{ username: '', email: '', password: '', gender: '' }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          autoFocus
                          fullWidth
                          error={errors.username && touched.username}
                          helperText={errors.username && touched.username ? <ErrorMessage>{errors.username}</ErrorMessage> : null}
                          id="username"
                          label="User Name"
                          name="username"
                          autoComplete="family-name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          error={errors.email && touched.email}
                          helperText={errors.email && touched.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          error={errors.password && touched.password}
                          helperText={errors.password && touched.password ? <ErrorMessage>{errors.password}</ErrorMessage> : null}
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          autoComplete="new-password"
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
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors.gender && touched.gender}>
                          <FormLabel component="legend">Gender</FormLabel>
                          <Field as={RadioGroup} name="gender" row>
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="other" control={<Radio />} label="Others" />
                          </Field>
                          {errors.gender && touched.gender && <ErrorMessage>{errors.gender}</ErrorMessage>}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <LoadingButton type="submit" fullWidth sx={{ mt: 3, mb: 2 }} loading={loading} variant="contained">
                      Submit
                    </LoadingButton>

                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link to="/login" style={{ color: mode == 'dark' ? 'white' : '' }} variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Container>
    </>
  );
}
