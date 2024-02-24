const USER = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const isRegistered = await USER.findOne({ email });

    if (isRegistered) {
      return res.status(400).json({ err: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await USER.create({ email, password: hashed, role });

    res.status(201).json({
      msg: "User created successfully",
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

const signIn = async (req, res) => {
  const { email, password, role } = req.body;
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
      { userId: user._id, role: user.role },
      process.env.TOKEN,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      msg: "Successfully logged in",
      user: {
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

module.exports = { signUp, signIn };
