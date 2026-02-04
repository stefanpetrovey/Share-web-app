const { Users, Posts, Likes } = require("../models");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { sign } = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists!
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password, email, name, surname, dateOfBirth } = req.body;
    const photo = req.file ? req.file.filename : null;

    // Check if user already exists
    const existingUser = await Users.findOne({
      where: {
        [require("sequelize").Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await Users.create({
      username: username,
      password: hash,
      email: email,
      name: name,
      surname: surname,
      dateOfBirth: dateOfBirth || null,
      photo: photo,
    });

    res.json("SUCCESS");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "User does NOT exist!" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match)
      return res.json({ error: "Wrong username and password combination." });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    
    res.json({ 
      token: accessToken, 
      username: username, 
      id: user.id,
      photo: user.photo 
    });
  });
};

// Validate token and get user info
const auth = async (req, res) => {
  try {
    // Fetch the user from database to get the latest photo
    const user = await Users.findByPk(req.user.id, {
      attributes: ["id", "username", "photo"]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      id: user.id,
      photo: user.photo
    });
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get basic user info
const getBasicInfo = async (req, res) => {
  try {
    console.log("PARAM ID:", req.params.id);

    const id = req.params.id;

    const user = await Users.findByPk(id, {
      attributes: ["id", "username", "name", "surname", "photo", "bio", "createdAt"],
    });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET BASIC INFO ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get full user profile (for editing)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await Users.findByPk(userId, {
      attributes: ["id", "username", "name", "surname", "email", "photo", "bio", "dateOfBirth"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER PROFILE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { name, surname, bio, email } = req.body;
    const photo = req.file ? req.file.filename : null;

    // Find the user
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await Users.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // If new photo is uploaded, delete old photo
    if (photo && user.photo) {
      const oldPhotoPath = path.join(__dirname, "../uploads", user.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user data
    const updateData = {
      name: name || user.name,
      surname: surname || user.surname,
      bio: bio !== undefined ? bio : user.bio,
      email: email || user.email,
    };

    if (photo) {
      updateData.photo = photo;
    }

    await Users.update(updateData, { where: { id: userId } });

    // Return updated user info
    const updatedUser = await Users.findByPk(userId, {
      attributes: ["id", "username", "name", "surname", "email", "photo", "bio"],
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete profile photo
const deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.photo) {
      const photoPath = path.join(__dirname, "../uploads", user.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }

      await Users.update({ photo: null }, { where: { id: userId } });
    }

    res.json({ message: "Profile photo deleted successfully" });
  } catch (err) {
    console.error("DELETE PHOTO ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findOne({
    where: { username: req.user.username },
  });

  bcrypt.compare(oldPassword, user.password).then((match) => {
    if (!match) {
      return res.json({ error: "Wrong password entered." });
    }

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
};

// Get all users
const getAll = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "username", "photo"],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all posts liked by a specific user
const getLikedPosts = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const likedPosts = await Likes.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Posts,
          include: [
            {
              model: Users,
              attributes: ["id", "username", "photo"]
            },
            {
              model: Likes
            }
          ]
        }
      ]
    });

    const posts = likedPosts.map(like => like.Post);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch liked posts" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === "") {
      return res.json([]);
    }

    const users = await Users.findAll({
      where: {
        username: {
          [require("sequelize").Op.iLike]: `%${query}%`  // Case-insensitive search
        }
      },
      attributes: ["id", "username", "photo"],
      limit: 10  // Limit results
    });

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

module.exports = {
  register,
  login,
  auth,
  getBasicInfo,
  getUserProfile,
  updateProfile,
  deleteProfilePhoto,
  changePassword,
  getAll,
  getLikedPosts,
  searchUsers,
};