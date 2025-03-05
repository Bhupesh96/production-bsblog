const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
} = require("../controllers/userController");

const router = express.Router();

//routes
//Register || Post
router.post("/register", registerController);

//Login || post
router.post("/login", loginController);

//update
router.put("/update-user", requireSignIn, updateUserController);
//exports
module.exports = router;
