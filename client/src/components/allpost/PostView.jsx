import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Divider, Skeleton, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '../Themecontext';
import axios from 'axios';
import moment from 'moment';
import DOMPurify from 'dompurify';
import Comment from '../comment/Comment';
import { decodeToken } from '../../utils/decode';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '96px',
  padding: '32px',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  marginBottom: 30,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    padding: '24px',
    marginTop: '72px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    marginTop: '60px',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '60%',
  height: 'auto',
  borderRadius: '10px',
  marginBottom: '24px',
  display: 'block',
  margin: '0 auto',
  transition: 'transform 0.3s, box-shadow 0.3s',
  [theme.breakpoints.down('md')]: {
    width: '80%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '16px',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const PostView = () => {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const { mode } = useTheme();
  const [cookies] = useCookies(['accessToken']);

  const accessToken = cookies.accessToken;
  const decodedToken = decodeToken(accessToken);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/singlepost/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/getcomments/${id}`);
      setComments(response.data.comments || []);

    } catch (error) {
      console.error(error);
    }
  };


  const editComment = () => {
    fetchComments();
  }
  const likeComment = () => {
    fetchComments();
  }

  const deleteComment = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/deletecomment/${id}`);

      if (response.status === 200 && response.data.message === "Comment deleted successfully") {
        toast.success(response.data.message);
        fetchComments();
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    fetchData();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {


    if (!decodedToken) {
      toast.error('You must be logged in to comment.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/comments`, {
        content: newComment,
        postId: id,
        userId: decodedToken._id
      });
      if (res.status === 201) toast.success('Comment created successfully');
      setNewComment('');
      fetchComments();

    } catch (error) {
      console.error(error);
      toast.error('Failed to create comment.');
    }
  };

  if (post === null) {
    return (
      <StyledContainer>
        <Skeleton variant="text" sx={{ fontSize: '2.5rem', marginBottom: '16px' }} />
        <Skeleton variant="rectangular" sx={{ width: '40%', height: 300, marginBottom: '24px', margin: 'auto', borderRadius: '10px' }} />
        <Skeleton variant="rectangular" sx={{ height: 200, marginTop: 4, marginBottom: '16px' }} />
        <Skeleton variant="text" sx={{ width: '50%', margin: '0 auto', marginTop: '16px' }} />
      </StyledContainer>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <StyledContainer>
      <Title>{post.title}</Title>

      <StyledImage
        src={post.frontImage}
        alt={post.title}
      />

      <Box
        component="div"
        sx={{
          fontSize: '1rem',
          marginTop: 4,
          lineHeight: '1.6',
          paddingBottom: '16px',
          padding: '16px',
          backgroundColor: mode === 'dark' ? '#868686' : '#f5f5f5',
          color: mode === 'dark' ? '#e0e0e0' : '#000000',
          textAlign: 'justify',
          borderRadius: '8px',
          '& p': {
            color: mode === 'dark' ? '#e0e0e0' : '#000000',
          },
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      <Divider sx={{ margin: '20px 0' }} />

      <Typography
        variant="subtitle1"
        sx={{ color: mode === 'dark' ? '#aaaaaa' : '#555555', textAlign: 'center' }}
      >
        {`Published on ${moment(post.createdAt).format('MMMM Do, YYYY')}`}
      </Typography>

      <Divider sx={{ margin: '20px 0' }} />

      <Box>
        <Typography variant="h6" sx={{ marginBottom: '16px' }}>
          {`Comments (${comments.length})`}
        </Typography>
        <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            sx={{ marginBottom: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
            Add Comment
          </Button>
        </Box>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onLike={likeComment}
            onDislike={(commentId) => console.log(`Dislike comment ${commentId}`)}
            onReply={fetchComments}
            onDelete={deleteComment}
            onEdit={editComment}

          />
        ))}
      </Box>
    </StyledContainer>
  );
};

export default PostView;
