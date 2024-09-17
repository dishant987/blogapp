import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Skeleton,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Dropzone from '../Dropzone'; // Update the path to your Dropzone component
import RTE from '../rte/RTE'; // Update the path to your RTE component
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import { decodeToken } from '../../utils/decode';
import { useNavigate, useParams } from 'react-router-dom';

const validationSchema = Yup.object({
    title: Yup.string(), // No longer required
    content: Yup.string(), // No longer required
    frontImage: Yup.mixed()
        .test('fileSize', 'File size is too large', value => !value || (value && value.size <= 5 * 1024 * 1024)) // 5MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type)))
        .notRequired(),
});

const EditPost = () => {
    const { postid } = useParams(); // Get post ID from URL parameters
    const [loading, setLoading] = useState(true); // Initial loading state
    const [post, setPost] = useState(null);
    const [cookies] = useCookies(['accessToken']);
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        title: '',
        content: '',
        frontImage: null,
    });

    useEffect(() => {
        // Fetch post data when component mounts
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/singlepost/${postid}`);
                setPost(response.data);

                setInitialValues({
                    title: response.data.title || '',
                    content: response.data.content || '',
                    frontImage: null, // Set to null or the existing image URL based on your needs
                });
                setLoading(false); // Data has been fetched
            } catch (error) {
                console.error('Error fetching post:', error);
                setLoading(false); // In case of error, stop loading
            }
        };
        fetchPost();
    }, [postid]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);


        const formData = new FormData();
        if (values.title) {
            formData.append('title', values.title);
        }
        if (values.content) {
            formData.append('content', values.content);
        }
        if (values.frontImage) {
            formData.append('file', values.frontImage);
            formData.append('oldimageurl', post.frontImage);
        }
        formData.append('postId', postid);

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/edituserpost`, formData);
            if (response.data.message === "Post updated successfully") {
                toast.success(response.data.message);
                navigate('/userpost');
            }
        } catch (error) {
            console.error('Error updating post:', error);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ marginTop: 12, marginBottom: 4 }}>
            <Grid container component={Paper} elevation={6} sx={{ padding: 3, borderRadius: 2 }}>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        Edit Post
                    </Typography>
                    {loading ? (
                        <Box sx={{ mt: 2 }}>
                            <Skeleton variant="text" width="80%" height="2rem" />
                            <Skeleton variant="rectangular" height="200px" sx={{ mt: 2 }} />
                            <Skeleton variant="text" width="60%" height="1rem" sx={{ mt: 2 }} />
                            <Skeleton variant="rectangular" height="40px" sx={{ mt: 2 }} />
                        </Box>
                    ) : (
                        post && (
                            <Formik
                                initialValues={initialValues}
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
                                                {loading ? <CircularProgress size={24} /> : 'Update Post'}
                                            </Button>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>
                        )
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default EditPost;
