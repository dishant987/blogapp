# MERN Stack Blog Web App

This is a responsive blog web application built using the MERN stack (MongoDB, Express, React, Node.js). The app features user authentication with email verification, and it allows users to create, read, update, and delete blog posts. The application also supports user profile pages and image uploads via Cloudinary.

## Features

- **User Authentication**: Sign up, sign in, and sign out with JWT-based authentication.
- **Email Verification**: Users must verify their email address to complete registration.
- **CRUD Operations**: Users can create, read, update, and delete blog posts.
- **Profile Page**: Each user has a profile page displaying their information and posts.
- **Image Uploads**: Images are uploaded and managed using Cloudinary.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image Hosting**: Cloudinary

## API Endpoints

Below is a list of the main API routes used in the application:

- **User Routes**:
  - `POST /users/signup`: Register a new user.
  - `POST /users/signin`: Log in a user.
  - `POST /users/logout`: Log out a user (requires JWT).
  - `POST /verifymail`: Verify user email.

- **Post Routes**:
  - `POST /addpost`: Create a new blog post (includes image upload).
  - `GET /allpost`: Retrieve all blog posts.
  - `GET /singlepost/:id`: Retrieve a single blog post by its ID.
  - `GET /singleuserpost/:userid`: Retrieve all posts by a specific user.
  - `DELETE /deletepost`: Delete a blog post.
  - `PUT /edituserpost`: Edit a blog post (includes image upload).

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (running locally or using a cloud service)
- [Cloudinary](https://cloudinary.com/) account for image hosting
- - **Vite**: A modern build tool for React applications. Install it globally if needed by running:
  ```bash
   npm create vite@latest

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dishant987/blog_mern.git
