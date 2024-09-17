import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Typography, Container, Box, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Model from './Model';
import { useTheme } from '../Themecontext';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Home = () => {
  const { mode } = useTheme();
  const navigate = useNavigate();
  const [cookies] = useCookies(['accessToken']);
  const isLoggedIn = Boolean(cookies.accessToken);

  return (
    <Container
      maxWidth="lg"
      sx={{

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',

      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '60vh', sm: '70vh', md: '80vh', lg: '80vh' }
        }}
      >
        <Canvas

          flat
          camera={{ fov: 60 }}
          sx={{ width: '100%', height: '100%' }}
        >
          <ambientLight />
          <Model />
          <EffectComposer>
            <Bloom
              mipmapBlur
              intensity={7.0}
              luminanceThreshold={0}
              luminanceSmoothing={0}
            />
          </EffectComposer>
        </Canvas>
      </Box>

      <Grid container spacing={2} sx={{ textAlign: 'center', mt: 4 }}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            component={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            sx={{
              color: mode === 'dark' ? '#ffffff' : '#000000',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' }
            }}
          >
            Welcome to My Blog
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="h5"
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            sx={{
              color: mode === 'dark' ? '#ffffff' : '#000000',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' }
            }}
          >
            Explore articles on web development, design, and more!
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ mt: 3 }}
            onClick={() => navigate(isLoggedIn ? '/userpost' : '/login')}
          >
            {isLoggedIn ? 'Show Posts' : 'Login'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
