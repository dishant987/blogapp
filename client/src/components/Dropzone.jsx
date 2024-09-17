import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from './Themecontext';

const Dropzone = ({ setFieldValue, fieldValue }) => {
  const [preview, setPreview] = useState(null);
  const { mode } = useTheme(); // Use theme context to get the current mode
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('frontImage', acceptedFiles[0]);
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    },
    multiple: false,
  });

  useEffect(() => {
    if (!fieldValue) {
      setPreview(null); // Clear preview when fieldValue is reset
    }
  }, [fieldValue]);

  const handleRemoveImage = () => {
    setFieldValue('frontImage', null);
    setPreview(null);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: mode === 'dark' ? 'grey.500' : 'grey.700',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? (mode === 'dark' ? 'darkgreen' : 'lightgreen') : (mode === 'dark' ? 'grey.800' : 'white'),
          color: mode === 'dark' ? 'white' : 'black',
          position: 'relative',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? 'Drop the image here ...'
            : 'Drag & drop your image here, or click to select one'}
        </Typography>
        {preview && (
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              mt: 2,
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: 1,
              transition: 'opacity 0.5s ease-in-out',
              opacity: preview ? 1 : 0,
            }}
          />
        )}
        {preview && (
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: mode === 'dark' ? 'grey.700' : 'white',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'grey.600' : 'lightgrey',
              },
            }}
          >
            <DeleteIcon sx={{ color: mode === 'dark' ? 'white' : 'black' }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Dropzone;
