import { Router } from "express";
import * as controller from "../controller/controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../helper/upload.js";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controller/comment.js";
const router = Router();

router.route("/users/signup").post(controller.signUp);
router.route("/users/signin").post(controller.signIn);
router.route("/users/logout").post(controller.userLogout);
router.route("/verifymail").post(controller.verifyEmail);
router.route("/addpost").post(upload.single("file"), controller.addPost);
router.route("/allpost").get(controller.AllPost);
router.route("/singlepost/:id").get(controller.SinglePost);
router.route("/singleuserpost/:userid").get(controller.SingleUserPost);
router.route("/deletepost").delete(controller.deletePost);
router.route("/comments").post(createComment);
router.route("/getcomments/:postId").get(getComments);
router.route("/deletecomment/:commentId").delete(deleteComment);
router
  .route("/edituserpost")
  .put(upload.single("file"), controller.editUserPost);

export default router;
