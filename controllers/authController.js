const USER = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const signUp = async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    const isRegistered = await USER.findOne({ email });

    if (isRegistered) {
      return res.status(400).json({ err: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const imageResult = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "userImage",
      }
    );

    fs.unlinkSync(req.files.image.tempFilePath);

    const user = await USER.create({
      email,
      password: hashed,
      role,
      name,
      image: imageResult.secure_url,
    });

    res.status(201).json({
      msg: "User created successfully",
      users: {
        email: user.email,
        role: user.role,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({ err: "Invalid credentials" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(404).json({ err: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, image: user.image},
      process.env.TOKEN,
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      msg: "Successfully logged in",
      users: {
        email: user.email,
        role: user.role,
        token,
        // name: user.name,
        // image: user.image
      },
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

module.exports = { signUp, signIn };
