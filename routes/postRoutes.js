const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostController,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

//router object
const router = express.Router();

//Create Post || Post
router.post("/create-post", requireSignIn, createPostController);

//get all post
router.get("/get-all-post", getAllPostController);

//get user post
router.get("/get-user-post", requireSignIn, getUserPostsController);

//delete post
router.delete("/delete-post/:id", requireSignIn, deletePostController);

//UPDATE POST
router.put("/update-post/:id", requireSignIn, updatePostController);

//export
module.exports = router;
