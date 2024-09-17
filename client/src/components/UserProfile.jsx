import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepPurple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { decodeToken } from '../utils/decode';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  fontSize: 19,
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}));

export default function SignUp() {
  const [cookies] = useCookies(['accessToken']);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.accessToken) {
      navigate('/');
    } else {
      try {
        const decodedToken = decodeToken(cookies.accessToken);
        setUserData(decodedToken);
      } catch (error) {
        console.error('Failed to decode token:', error);
        navigate('/');
      }
    }
  }, [cookies.accessToken, navigate]);

  const isLoading = !userData;

  return (
    <Container component="main" maxWidth="sm">
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} sx={{ borderRadius: 4, marginTop: 15, padding: 4 }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack>
            {isLoading ? (
              <Skeleton variant="circular" width={90} height={90} />
            ) : (
              <Avatar sx={{ bgcolor: deepPurple[500], width: 80, height: 80 }} />
            )}
          </Stack>
          <Typography component="h1" marginTop={3} variant="h5">
            {isLoading ? <Skeleton width={300} /> : 'Profile'}
          </Typography>

          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Item>
                  {isLoading ? <Skeleton width="100%" /> : `Username: ${userData?.username}`}
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  {isLoading ? <Skeleton width="100%" /> : `Email: ${userData?.email}`}
                </Item>
              </Grid>
            </Grid>
            {/* Optionally add a Save button with a skeleton loader */}
            {/* <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <Skeleton width="60%" /> : 'Save'}
            </Button> */}
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}
