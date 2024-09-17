import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, IconButton, Skeleton } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { styled } from '@mui/system';
import { useTheme } from '../Themecontext';
import { Link } from 'react-router-dom';
import StarryBackground from '../Star/StarryBackground';
import { useCookies } from 'react-cookie';
import { decodeToken } from '../../utils/decode';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import Tooltip from '@mui/material/Tooltip';

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
    backgroundColor: mode === 'dark' ? 'rgba(51, 51, 51, 0.6)' : 'rgba(245, 245, 245, 0.6)',
    color: mode === 'dark' ? '#fff' : '#000',
    backdropFilter: 'blur(10px)',
    transition: 'background-color 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out',
    '&:hover': {
        backgroundColor: mode === 'dark' ? 'rgba(51, 51, 51, 0.8)' : 'rgba(245, 245, 245, 0.8)',
        backdropFilter: 'blur(20px)',
    },
}));

const IconGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    gap: '8px',
}));

const UserPost = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { mode } = useTheme();
    const [cookies] = useCookies(['accessToken']);

    // const fetchData = async () => {
    //     const accessToken = cookies.accessToken;
    //     const decodedToken = decodeToken(accessToken);
    //     let userId = ''
    //     if (decodedToken) {
    //         userId = decodedToken._id;
    //     } else {
    //         return '';
    //     }
    //     try {
    //         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/singleuserpost/${userId}`, { withCredentials: true });
    //         setData(response.data);
    //         console.log(response)
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchData = async () => {
        const accessToken = cookies.accessToken;
        const decodedToken = decodeToken(accessToken);
        let userId = ''
        if (decodedToken) {
            userId = decodedToken._id;
        } else {
            return '';
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/singleuserpost/${userId}`);
            if (Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);  // Or handle it differently based on your needs
            }
        } catch (error) {
            console.log(error);
            setData([]);  // Handle error by setting data to an empty array
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (postId, frontImage) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/deletepost`, {
                data: { postId, frontImage },
                withCredentials: true
            });

            if (response.data.message === "Post deleted successfully") {
                toast.success(response.data.message);
                setData(data.filter(post => post._id !== postId));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
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
                <Grid container spacing={2}>
                    {loading ? (
                        Array.from(new Array(4)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <StyledCard>
                                    <PostCard>
                                        <Skeleton variant="rectangular" width="100%" height={180} />
                                        <ContentBox mode={mode}>
                                            <Skeleton variant="text" width="80%" />
                                            <Skeleton variant="text" width="40%" />
                                        </ContentBox>
                                        <IconGroup>
                                            <Skeleton variant="circular" width={24} height={24} />
                                            <Skeleton variant="circular" width={24} height={24} />
                                        </IconGroup>
                                    </PostCard>
                                </StyledCard>
                            </Grid>
                        ))
                    ) : (
                        Array.isArray(data) && data.length === 0 ? (
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', width: '100%' }}>
                                No posts available
                            </Typography>
                        ) : (
                            Array.isArray(data) && data.map((post, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
                                    <StyledCard>
                                        <PostCard>
                                            <Box
                                                component="img"
                                                src={post.frontImage}
                                                alt={post.title}
                                                sx={{
                                                    height: '180px',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px 8px 0 0',
                                                }}
                                            />
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
                                            <IconGroup>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        component={Link}
                                                        to={`/editpost/${post._id}`}
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleDelete(post._id, post.frontImage)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </IconGroup>
                                        </PostCard>
                                    </StyledCard>
                                </Grid>
                            ))
                        )
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default UserPost;
