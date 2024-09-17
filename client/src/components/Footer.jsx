import React from 'react';
import { Container, Box, Typography, Link, Grid, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GitHub, Facebook, Instagram } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTheme } from './Themecontext';

const Footer = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                p: 3,
                mt: '60px',
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={4} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box>
                            <Link
                                component={RouterLink}
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    mb: 1,
                                    textDecoration: "none",
                                    color: 'text.primary',
                                    textShadow: '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5)',
                                    transition: 'text-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7)',
                                    }
                                }}
                            >
                                Home
                            </Link>
                            <Link
                                component={RouterLink}
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    mb: 1,
                                    textDecoration: "none",
                                    color: 'text.primary',
                                    textShadow: '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5)',
                                    transition: 'text-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7)',
                                    }
                                }}
                            >
                                About
                            </Link>
                            <Link
                                component={RouterLink}
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    mb: 1,
                                    textDecoration: "none",
                                    color: 'text.primary',
                                    textShadow: '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5)',
                                    transition: 'text-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7)',
                                    }
                                }}
                            >
                                Posts
                            </Link>
                            <Link
                                component={RouterLink}
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    textDecoration: "none",
                                    color: 'text.primary',
                                    textShadow: '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5)',
                                    transition: 'text-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7)',
                                    }
                                }}
                            >
                                Contact
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Follow Us
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <IconButton
                              
                                rel="noopener"
                                aria-label="GitHub"
                            >
                                <GitHub sx={{ fontSize: 40, color: isDarkMode ? '#EAEAEA' : '#333' }} />
                            </IconButton>
                            <IconButton
                              
                                rel="noopener"
                                aria-label="Facebook"
                            >
                                <Facebook sx={{ fontSize: 40, color: isDarkMode ? '#EAEAEA' : '#3b5998' }} />
                            </IconButton>
                            <IconButton
                             
                                rel="noopener"
                                aria-label="Instagram"
                            >
                                <Instagram sx={{ fontSize: 40, color: isDarkMode ? '#ffffff' : '#E4405F' }} />
                            </IconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Email: support@example.com
                        </Typography>
                        <Typography variant="body2">
                            Phone: (123) 456-7890
                        </Typography>
                    </Grid>
                </Grid>

                <Box textAlign="center" mt={3}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} My BlogApp made with{' '}
                        <FavoriteIcon sx={{ color: 'red', verticalAlign: 'middle' }} />{' '}
                        by Dishant
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
