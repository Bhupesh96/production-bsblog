const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
  updatePushTokenController,
} = require("../controllers/userController");

const router = express.Router();

//routes
//Register || Post
router.post("/register", registerController);

//Login || post
router.post("/login", loginController);

//update
router.put("/update-user", requireSignIn, updateUserController);
router.post("/update-push-token", requireSignIn, updatePushTokenController);
//exports
module.exports = router;
