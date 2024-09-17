import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Divider, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { ThumbUp, ThumbDown, Reply, MoreVert, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '../Themecontext';
import { useCookies } from 'react-cookie';
import { decodeToken } from '../../utils/decode';

const Comment = ({ comment, onLike, onDislike, onReply, onEdit, onDelete }) => {
  const { mode } = useTheme();
  const [replyContent, setReplyContent] = useState('');
  const [cookies] = useCookies(['accessToken']);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For menu positioning
  const open = Boolean(anchorEl);

  const userId = decodeToken(cookies.accessToken)._id;

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return; // Prevent empty replies

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/comments/${comment._id}/reply`, { content: replyContent });
      onReply(); // Refresh or perform any action after reply submission
      setReplyContent(''); // Clear the reply input
      setShowReplyBox(false); // Close the reply box
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(comment._id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(comment._id);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        backgroundColor: mode === 'dark' ? '#2c2c2c' : '#f9f9f9',
        color: mode === 'dark' ? '#f0f0f0' : '#000000',
        position: 'relative', // Add relative positioning for the container
      }}
    >
      {/* More options button at the top right */}
      {userId === comment.author && (
        <IconButton
          aria-label="more"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          sx={{
            position: 'absolute',
            top: '8px', // Adjust for desired vertical position
            right: '8px', // Adjust for desired horizontal position
          }}
        >
          <MoreVert />
        </IconButton>
      )}

      {/* Menu for MoreVert Button */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        sx={{
          maxHeight: 48 * 4.5, // Optional: customize height
          width: '20ch',
          borderRadius: '30px',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Comment Author and Content */}
      <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {comment.authorname}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '12px' }}>
        {comment.content}
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconButton onClick={() => onLike(comment._id)} color="primary">
          <ThumbUp />
        </IconButton>
        <Typography variant="body2" sx={{ marginRight: '8px' }}>
          {comment.likeCount || 0}
        </Typography>
        <IconButton onClick={() => onDislike(comment._id)} color="secondary">
          <ThumbDown />
        </IconButton>
        <IconButton
          // onClick={() => setShowReplyBox(!showReplyBox)}

          color="default">
          <Reply />
        </IconButton>
      </Box>

      {/* Reply Input Box */}
      {showReplyBox && (
        <Box sx={{ marginTop: '16px' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={replyContent}
            onChange={handleReplyChange}
            placeholder="Write a reply..."
            sx={{
              marginBottom: '8px',
              backgroundColor: mode === 'dark' ? '#3c3c3c' : '#ffffff',
              borderRadius: '8px',
            }}
          />
          <Button variant="contained" color="primary"
            onClick={handleReplySubmit}
          >
            Reply
          </Button>
        </Box>
      )}

      {/* Divider between comment and replies */}
      {comment.replies && comment.replies.length > 0 && <Divider sx={{ marginY: '16px' }} />}

      {/* Replies Section */}
      {comment.replies?.map((reply) => (
        <Box
          key={reply._id}
          sx={{
            padding: '8px 16px',
            marginTop: '8px',
            borderRadius: '8px',
            backgroundColor: mode === 'dark' ? '#3c3c3c' : '#f0f0f0',
          }}
        >
          <Typography variant="body2" sx={{ color: mode === 'dark' ? '#f0f0f0' : '#000' }}>
            {reply.content}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Comment;
