import { sendEmail } from "../helper/mailer.js";
import { User } from "../models/user.js";
import post from "../models/post.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../helper/funccloud.js";
import validator from "validator";

const generateAccessTokenAndRefereshToken = async function (userId, res) {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message:
        "Something went Wrong while generating referesh and access token",
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Password is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Email is required" });
    }
    if (!username) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Username is required" });
    }

    // Validate email format

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ statuscode: 400, message: "Invalid email format" });
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      return res.status(409).json({
        statuscode: 409,
        message: "User with email or username already exists",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      gender: gender.toLowerCase(),
    });

    if (!user) {
      return res.status(500).json({
        statuscode: 500,
        message: "Something went wrong while registering the user",
      });
    }

    try {
      await sendEmail({ email, emailType: "VERIFY", userId: user._id });
      return res.status(201).json({
        statuscode: 201,
        message: "Email sent successfully. Verify your email for login.",
      });
    } catch (emailError) {
      return res.status(500).json({
        statuscode: 500,
        message: "Failed to send verification email. Please try again later.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ statuscode: 500, message: error.message });
  }
};

//signin
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({
        statuscode: 400,
        message: " password is required",
      });
    }
    if (!email) {
      return res.status(400).json({
        statuscode: 400,
        message: "email is required",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { password }],
    });

    if (!user) {
      return res.status(404).json({
        statuscode: 404,
        message: "User does not exist",
      });
    }
    if (user.isVerfied === false) {
      await sendEmail({ email, emailType: "VERIFY", userId: user._id });
      return res.status(404).json({
        statuscode: 404,
        message: "Email is Not Verify",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statuscode: 401,
        message: "Invalid User credentials",
      });
    }

    const { accessToken } = await generateAccessTokenAndRefereshToken(user._id);

    const LoggedInUser = await User.findById(user._id).select("-password ");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("accessToken", accessToken, options).json({
      statuscode: 200,
      user: LoggedInUser,
      accessToken,
      message: "Login SuccessFully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statuscode: 500,
      message: error.message,
    });
  }
};

//logout
export async function userLogout(req, res) {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.clearCookie("accessToken", options).status(200).json({
    message: "User Logged Out",
  });
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (user === null) {
      return res
        .status(200)
        .json({ message: "Email is already verifyed", status: 200 });
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid token", status: 400 });
    }
    // console.log(user);
    user.isVerfied = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, status: 500 });
  }
}

export async function addPost(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, content, userId } = req.body;
    const { file } = req;

    // Validate inputs
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    let imageUrl = "";
    if (file) {
      // Upload image to Cloudinary
      const result = await uploadFileToCloudinary(file);

      imageUrl = result.url;
    }

    // Save the post to the database

    const newPost = new post({
      title,
      content,
      author: userId,
      frontImage: imageUrl,
    });

    await newPost.save();

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function AllPost(req, res) {
  try {
    const posts = await post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function SinglePost(req, res) {
  try {
    const userId = req.params.id;
    const onepost = await post.findById(userId);
    if (!onepost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(onepost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function SingleUserPost(req, res) {
  try {
    const userId = req.params.userid;
    const onepost = await post.find({ author: userId });

    if (!onepost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(onepost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function editUserPost(req, res) {
  try {
    const { title, content, postId, oldimageurl } = req.body;
    const { file } = req;
    console.log("Received data:", {
      title,
      content,
      postId,
      oldimageurl,
      file,
    });
    // Check for required fields
    if (!postId || (!title && !content)) {
      return res
        .status(400)
        .json({ message: "Required fields are missing or empty" });
    }

    // Prepare an update object
    const updateFields = {};

    // Conditionally add fields to the update object
    if (title) {
      updateFields.title = title;
    }

    if (content) {
      updateFields.content = content;
    }

    if (file) {
      // Extract the public ID from the old image URL if it exists
      if (oldimageurl) {
        const urlParts = oldimageurl.split("/");
        const publicId = urlParts.slice(-2).join("/").split(".")[0];
        const res = await deleteFileFromCloudinary(publicId);
      }

      // Upload the new image to Cloudinary
      const result = await uploadFileToCloudinary(file);
      updateFields.frontImage = result.url; // Add the new image URL to the update object
    }

    // Update the post only if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      await post.updateOne({ _id: postId }, { $set: updateFields });
      res.status(200).json({ message: "Post updated successfully" });
    } else {
      res.status(400).json({ message: "No changes detected" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deletePost(req, res) {
  try {
    const { postId, frontImage } = req.body;

    // Delete image from Cloudinary if URL is provided
    if (frontImage) {
      const urlParts = frontImage.split("/");
      const publicId = urlParts.slice(-2).join("/").split(".")[0];
      await deleteFileFromCloudinary(publicId);
    }

    // Perform the deletion of the post
    const result = await post.deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
