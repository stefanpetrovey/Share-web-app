const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const { validateToken } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload"); // ← Use shared upload

// Public routes
router.post("/", upload.single("photo"), UsersController.register);
router.post("/login", UsersController.login);
router.get("/basicinfo/:id", UsersController.getBasicInfo);
router.get("/byUserId/:userId", UsersController.getLikedPosts);
router.get("/search", UsersController.searchUsers);

// Protected routes
router.get("/auth", validateToken, UsersController.auth);
router.get("/profile", validateToken, UsersController.getUserProfile);
router.put("/profile", validateToken, upload.single("photo"), UsersController.updateProfile);
router.delete("/profile/photo", validateToken, UsersController.deleteProfilePhoto);
router.put("/changepassword", validateToken, UsersController.changePassword);
router.get("/", validateToken, UsersController.getAll);

module.exports = router;