import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerifyEmail from './components/VerifyEmail';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar';
import AddPostForm from './components/Addpost';
import { CookiesProvider } from 'react-cookie';
import { useTheme } from './components/Themecontext';
import AllPost from './components/allpost/AllPost';
import PostView from './components/allpost/PostView';
import UserPost from './components/allpost/UserPost';
import EditPost from './components/allpost/EditPost';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/home/Home'
import Footer from './components/Footer';
import { Box } from '@mui/material';
// Layout Component with Navbar
const Layout = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Navbar />
    <Box sx={{ flex: 1 }}>
      <Outlet /> {/* Renders the matched route's component */}
    </Box>
    <Footer />
  </Box>
);

const App = () => {
  const { mode } = useTheme(); // Access the theme mode from ThemeContext
  const defaultTheme = createTheme({ palette: { mode } });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Use the Layout for all routes
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/profile",

          element: <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>,
        },
        {
          path: "/verifyemail",
          element:
            <VerifyEmail />
       
        },
        {
          path: "/addpost",
          element: <ProtectedRoute>
            <AddPostForm />
          </ProtectedRoute>,
        },
        {
          path: "/allpost",
          element: <AllPost />,
        },
        {
          path: "/post/:id",
          element:
            <PostView />

        },
        {
          path: "/userpost",
          element: <ProtectedRoute>
            <UserPost />
          </ProtectedRoute>,
        },
        {
          path: "/editpost/:postid",
          element: <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>,
        },

      ],
    },
  ]);

  return (
    <MUIThemeProvider theme={defaultTheme}>
      <CookiesProvider>
        <CssBaseline />
        <RouterProvider router={router}>

        </RouterProvider>
      </CookiesProvider>
    </MUIThemeProvider>
  );
};

export default App;
