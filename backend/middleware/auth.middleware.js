import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token : ", token);
    if (!token) {
      return res.status(401).json({
        statuscode: 401,
        message: "Unauthorized request",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedToken);
    const user = await User.findById(decodedToken._id).select("-password ");
    if (!user) {
      return res.status(401).json({
        statuscode: 401,
        message: "Invalid Access Token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(500).json({
      statuscode: 500,
      message: error.message || "Invalid Access Token",
    });
  }
};
