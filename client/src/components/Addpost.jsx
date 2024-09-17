import React, { useState } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Dropzone from './Dropzone'; // Update the path to your Dropzone component
import RTE from './rte/RTE'; // Update the path to your RTE component
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import { decodeToken } from '../utils/decode';
import StarryBackground from '../components/Star/StarryBackground';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    frontImage: Yup.mixed().required('Front image is required')
        .test('fileSize', 'File size is too large', value => !value || (value && value.size <= 5 * 1024 * 1024)) // 5MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
});

const AddPostForm = () => {
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['accessToken']);
    const navigate = useNavigate()
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);

        const accessToken = cookies.accessToken;
        let userId = '';
        const decodedToken = decodeToken(accessToken); // Use the utility function to decode the token

        if (decodedToken) {
            userId = decodedToken._id;
        } else {
            setLoading(false);
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('file', values.frontImage);
        formData.append('userId', userId); // Append user ID to form data

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/addpost`, formData);
            if (response.data.message == "Post added successfully") {
                toast.success(response.data.message)
                resetForm();
                navigate('/userpost')
            }
          
        } catch (error) {
            console.error('Error adding post:', error);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <>
            <StarryBackground />
            <Container component="main" maxWidth="md" sx={{ marginTop: 12, marginBottom: 4 }}>
                <Grid container component={Paper} elevation={6} sx={{ padding: 3, borderRadius: 2 }}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            Add Post
                        </Typography>
                        <Formik
                            initialValues={{ title: '', content: '', frontImage: null }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, errors, touched, isSubmitting, values }) => (
                                <Form>
                                    <Box sx={{ mt: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Field
                                                    as={TextField}
                                                    name="title"
                                                    label="Title"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={errors.title && touched.title}
                                                    helperText={errors.title && touched.title ? errors.title : null}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RTE
                                                    name="content"
                                                    label="Content"
                                                    value={values.content}
                                                    onChange={(name, content) => setFieldValue(name, content)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Dropzone setFieldValue={setFieldValue} fieldValue={values.frontImage} />
                                                {errors.frontImage && touched.frontImage && (
                                                    <Typography variant="caption" color="error">
                                                        {errors.frontImage}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ mt: 3 }}
                                            disabled={isSubmitting}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Add Post'}
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default AddPostForm;
