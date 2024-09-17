import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Skeleton } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { styled } from '@mui/system';
import { useTheme } from '../Themecontext';
import { Link } from 'react-router-dom';
import StarryBackground from '../Star/StarryBackground';

const StyledCard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.4s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const PostCard = styled(Box)(({ theme }) => ({
  minHeight: '250px',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: theme.shadows[5],
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[10],
  },
}));

const ContentBox = styled(Box)(({ mode }) => ({
  padding: '16px',
  flex: 1,
  backgroundColor: mode === 'dark' ? 'rgba(51, 51, 51, 0.6)' : 'rgba(245, 245, 245, 0.6)', // Semi-transparent background for glass effect
  color: mode === 'dark' ? '#fff' : '#000',
  backdropFilter: 'blur(10px)',
  transition: 'background-color 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out',
  '&:hover': {
    backgroundColor: mode === 'dark' ? 'rgba(51, 51, 51, 0.8)' : 'rgba(245, 245, 245, 0.8)',
    backdropFilter: 'blur(20px)',
  },
}));

const PostImage = styled(Box)(({ theme }) => ({
  height: '180px',
  width: '100%',
  borderRadius: '8px 8px 0 0', // Only round top corners
  position: 'relative',
}));

const PostsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const { mode } = useTheme(); // Access the current theme mode (light or dark)

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/allpost`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StarryBackground />
      <Container sx={{ marginTop: 15 }}>
        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => ( // Show 4 skeleton loaders
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <StyledCard>
                  <PostCard>
                    <PostImage>
                      <Skeleton variant="rectangular" height="180px" />
                    </PostImage>
                    <ContentBox mode={mode}>
                      <Skeleton variant="text" width="80%" height="2rem" />
                      <Skeleton variant="text" width="40%" height="1rem" />
                    </ContentBox>
                  </PostCard>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : data.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No posts available
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {data.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
                  <StyledCard>
                    <PostCard>
                      <PostImage>
                        <img
                          src={post.frontImage}
                          alt={post.title}
                          style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0',
                            display: 'block',
                          }}
                          onLoad={(e) => e.target.style.opacity = 1}
                          onError={(e) => e.target.style.opacity = 0}
                        />
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            visibility: post.frontImage ? 'hidden' : 'visible',
                          }}
                        />
                      </PostImage>
                      <ContentBox mode={mode}>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            color: mode === 'dark' ? '#fff' : '#000',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: mode === 'dark' ? '#bbb' : '#666',
                            marginTop: '8px',
                            display: 'block',
                          }}
                        >
                          {moment(post.createdAt).fromNow()}
                        </Typography>
                      </ContentBox>
                    </PostCard>
                  </StyledCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default PostsList;
