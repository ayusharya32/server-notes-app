const express = require('express')
const { authenticateUser } = require('../utils/AuthUtils')
const router = express.Router()
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController')

router
    .route("/register")
    .post(registerUser)

router
    .route("/login")
    .post(loginUser)

router
    .route("/user")
    .get(authenticateUser, getCurrentUser)

module.exports = router