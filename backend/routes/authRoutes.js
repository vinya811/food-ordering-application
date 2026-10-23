const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

// =========================
// SIGNUP
// =========================

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password."
      });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
});

// =========================
// UPDATE PROFILE
// =========================

router.put("/profile", async (req, res) => {
  try {
    const { email, name, newEmail } = req.body;

    if (!email || !name || !newEmail) {
      return res.status(400).json({
        message: "Name and email are required."
      });
    }

    const currentEmail = email.trim().toLowerCase();
    const updatedEmail = newEmail.trim().toLowerCase();

    // Find the current user
    const user = await User.findOne({
      email: currentEmail
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    // If email is being changed, make sure another
    // account isn't already using it.
    if (currentEmail !== updatedEmail) {
      const existingUser = await User.findOne({
        email: updatedEmail
      });

      if (existingUser) {
        return res.status(400).json({
          message: "That email is already in use."
        });
      }
    }

    user.name = name.trim();
    user.email = updatedEmail;

    await user.save();

    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
});

module.exports = router;