const { compare } = require("bcrypt");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
var { expressjwt: jwt, expressjwt } = require("express-jwt");

//middleware
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const registerController = async (req, res) => {
  try {
    const { name, email, password, pushToken } = req.body; // Get push token
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user to database
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      pushToken, // ✅ Store push token
    });

    res.status(201).send({
      success: true,
      message: "Registration successful, please login",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Error in register API", error });
  }
};

//login
const loginController = async (req, res) => {
  try {
    const { email, password, pushToken } = req.body; // Get push token

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Email and Password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found, please register" });
    }

    // Match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials" });
    }

    // Update push token in DB
    if (pushToken) {
      user.pushToken = pushToken;
      await user.save();
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Error in login API", error });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    //password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message:
          "Password is require and should be greater than or equal to 6 character",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //update user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile updated please login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in user-update API".error,
    });
  }
};

const updatePushTokenController = async (req, res) => {
  try {
    const { pushToken } = req.body;
    const userId = req.auth._id; // Get user ID from JWT

    if (!pushToken) {
      return res
        .status(400)
        .send({ success: false, message: "Push token is required" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { pushToken },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Push token updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Error updating push token", error });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
  updatePushTokenController,
};
