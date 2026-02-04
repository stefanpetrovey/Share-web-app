const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const LikesController = require("../controllers/LikesController");

router.post("/", validateToken, LikesController.toggleLike);

module.exports = router;
