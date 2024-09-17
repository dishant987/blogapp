import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { ThumbUp, ThumbDown, Reply, MoreVert, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '../Themecontext';
import { useCookies } from 'react-cookie';
import { decodeToken } from '../../utils/decode';
import toast from 'react-hot-toast';
import moment from 'moment';

const Comment = ({ comment, onLike, onReply, onEdit, onDelete }) => {
  const { mode } = useTheme();
  const [replyContent, setReplyContent] = useState('');
  const [cookies] = useCookies(['accessToken']);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For menu positioning
  const [isEditing, setIsEditing] = useState(false); // To toggle between editing and viewing
  const [editedContent, setEditedContent] = useState(comment.content); // Track edited content
  const [repliesToShow, setRepliesToShow] = useState(3); // Number of replies to show
  const [showMoreReplies, setShowMoreReplies] = useState(true); // To handle showing more replies
  const [replyMenus, setReplyMenus] = useState({}); // For reply menu positioning
  const open = Boolean(anchorEl);
  const userId = cookies.accessToken ? decodeToken(cookies.accessToken)?._id : null;

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyContent.trim()) return; // Prevent empty replies

    if (!userId) {
      toast.error('You must be logged in to reply to comment.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/comments/${commentId}/reply`, {
        content: replyContent,
        replierId: userId,
        recipientId: comment.author,
      })
      console.log(res)
      if (res.status === 201 && res.data.message === "Reply added successfully") {

        toast.success(res.data.message);


        onReply(); // Refresh or perform any action after reply submission
        setReplyContent(''); // Clear the reply input
        setShowReplyBox(false); // Close the reply box
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Error submitting reply. Please try again.');
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReplyMenuOpen = (event, replyId) => {
    setReplyMenus((prev) => ({ ...prev, [replyId]: event.currentTarget }));
  };

  const handleReplyMenuClose = (replyId) => {
    setReplyMenus((prev) => ({ ...prev, [replyId]: null }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleLike = async (commentId) => {
    if (!userId) {
      toast.error('You must be logged in to like comment.');
      return;
    }
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/comments/like`, {
        commentId,
        userId,
      });

      if (res.status === 200 || res.data.message === "Comment liked successfully") {
        toast.success(res.data.message);
        onLike();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Error liking comment. Please try again.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/updatecomment`, { content: editedContent, commentId: comment._id });
      if (res.status === 200 || res.data.message === "Comment updated successfully") {
        toast.success(res.data.message);
      }
      onEdit(comment._id);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Error updating comment. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleDelete = () => {
    onDelete(comment._id);
    handleMenuClose();
  };

  const handleShowMoreReplies = () => {
    if (repliesToShow + 3 >= comment.replies.length) {
      setRepliesToShow(comment.replies.length);
      setShowMoreReplies(false);
    } else {
      setRepliesToShow(repliesToShow + 3);
    }
  };

  const handleReplyDelete = async (replyId) => {
    // Implement delete reply functionality
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/comments/${comment._id}/reply/${replyId}`);
      console.log(res.data)
      if (res.status === 200 && res.data.message === "Reply deleted successfully") {
        toast.success(res.data.message);
      }
      onReply();
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Error deleting reply. Please try again.');

    }
    handleReplyMenuClose(replyId);
  };

  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        backgroundColor: mode === 'dark' ? '#2c2c2c' : '#f9f9f9',
        color: mode === 'dark' ? '#f0f0f0' : '#000000',
        position: 'relative',
      }}
    >
      {/* More options button at the top right */}
      {userId === comment.author && (
        <IconButton
          aria-label="more options"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
          }}
        >
          <MoreVert />
        </IconButton>
      )}

      {/* Menu for MoreVert Button */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          maxHeight: 48 * 4.5,
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
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: mode === 'dark' ? '#f0f0f0' : '#000000',
        }}
      >
        {comment.authorname}
        <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '0.9rem' }}>
          &#x2022; {moment(comment.createdAt).fromNow()}
        </span>
      </Typography>

      {/* Editable Text Field for Editing */}
      {isEditing ? (
        <>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{
              marginBottom: '8px',
              backgroundColor: mode === 'dark' ? '#3c3c3c' : '#ffffff',
              borderRadius: '8px',
            }}
          />
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button variant="contained" color="primary" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1" sx={{ marginBottom: '12px' }}>
          {comment.content}
        </Typography>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconButton aria-label="like" onClick={() => handleLike(comment._id)} color="primary">
          <ThumbUp />
        </IconButton>
        <Typography variant="body2" sx={{ marginRight: '8px' }}>
          {comment.likes.length || 0}
        </Typography>

        <IconButton
          aria-label="reply"
          onClick={() => setShowReplyBox(!showReplyBox)}
          color="default"
        >
          <Reply />
        </IconButton>
      </Box>

      {/* Reply Box */}
      {showReplyBox && (
        <Box sx={{ marginTop: '16px' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a reply..."
            value={replyContent}
            onChange={handleReplyChange}
            sx={{
              marginBottom: '8px',
              backgroundColor: mode === 'dark' ? '#3c3c3c' : '#ffffff',
              borderRadius: '8px',
            }}
          />
          <Button variant="contained" color="primary" onClick={() => handleReplySubmit(comment._id)}>
            Reply
          </Button>
        </Box>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.slice(0, repliesToShow).map((reply) => (
        <Box
          key={reply._id}
          sx={{
            padding: '12px',
            margin: '8px',
            marginTop: '8px',
            marginLeft: '48px',
            borderRadius: '8px',
            backgroundColor: mode === 'dark' ? '#3c3c3c' : '#eaeaea',
            marginBottom: '8px',
            position: 'relative',
          }}
        >
          <IconButton
            aria-label="more options"
            aria-haspopup="true"
            onClick={(e) => handleReplyMenuOpen(e, reply._id)}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
            }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={replyMenus[reply._id]}
            open={Boolean(replyMenus[reply._id])}
            onClose={() => handleReplyMenuClose(reply._id)}
            sx={{
              maxHeight: 48 * 4.5,
              width: '20ch',
              borderRadius: '30px',
            }}
          >
            <MenuItem onClick={() => handleReplyDelete(reply._id)}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>

          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: mode === 'dark' ? '#f0f0f0' : '#000000',
            }}
          >
            {reply.replyAuthorName}&nbsp;
            <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '0.8rem' }}>
              &#x2022; {moment(reply.createdAt).fromNow()}
            </span>
          </Typography>
          <Typography variant="body2" sx={{ color: mode === 'dark' ? '#f0f0f0' : '#000' }}>
            <span style={{ color: mode === 'dark' ? 'skyblue' : '#000' }}>@{reply.mentionedUserName}</span> &nbsp;&nbsp; {reply.content}
          </Typography>


        </Box>
      ))}

      {/* Show more replies button */}
      {showMoreReplies && comment.replies.length > repliesToShow && (
        <Button onClick={handleShowMoreReplies} sx={{ marginTop: '8px' }}>
          Show more replies
        </Button>
      )}
    </Box>
  );
};

export default Comment;
