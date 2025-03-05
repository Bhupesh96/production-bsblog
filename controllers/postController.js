const postModel = require("../models/postModel");

//Create Post
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //validate
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();
    res.status(201).send({
      success: true,
      message: "post created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messgage: "Error in create post API",
      error,
    });
  }
};

//get all post
const getAllPostController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In GETALLPOSTS API",
      error,
    });
  }
};
//get user posts
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "User Posts",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in getUserPostsController API",
      error,
    });
  }
};

//delete post
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in deletePostController API",
      error,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //post find
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide post title or description",
      });
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in update post api",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostController,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
