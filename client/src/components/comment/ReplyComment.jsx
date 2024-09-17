import { Delete, MoreVert } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';

const ReplyComment = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        // onDelete(comment._id);
        handleMenuClose();
    };
    return (

        <>
            <IconButton
                aria-label="more options"
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
                {/* <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem> */}
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>

                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

        </>
    )
}

export default ReplyComment