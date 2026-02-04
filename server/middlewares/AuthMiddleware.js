const { verify } = require("jsonwebtoken");
const { Users } = require("../models");

const validateToken = async (req, res, next) => {
  // Try both variations
  const accessToken = req.header("accessToken") || req.headers.accesstoken;

  if (!accessToken) {
    return res.json({ error: "User not logged in!" });
  }

  try {
    const validToken = verify(accessToken, "importantsecret");
    
    if (validToken) {
      // Fetch user with photo
      const user = await Users.findByPk(validToken.id, {
        attributes: ["id", "username", "photo"]
      });

      if (user) {
        req.user = {
          id: user.id,
          username: user.username,
          photo: user.photo
        };
        return next();
      } else {
        return res.json({ error: "User not found" });
      }
    }
  } catch (err) {
    console.error("Token validation error:", err);
    return res.json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };