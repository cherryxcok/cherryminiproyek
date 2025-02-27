// filepath: /Users/cherrycok/Desktop/Kuliah/SEM 7/PPW II - Triandes/miniproyek/cherryminiproyek/routes/auth.js
const express = require("express");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;