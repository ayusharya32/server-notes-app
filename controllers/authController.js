const User = require('../models/User')
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {
    const { name, email, password } = req.body

    try {
        const user = await User.create({ name, email, password })
        const token = createToken(user._id)

        res.status(201).json({ accessToken: token })

    } catch(err) {
        const errResponse = handleAuthErrors(err)
        console.log(errResponse);
        res.status(404).json(errResponse)
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body
    
    if(email === undefined || password === undefined) {
        res.status(400).json({ message: "Request Body Parameters (email, password) not provided" })
    }

    try {
        const authenticatedUser = await User.login(email, password)
        console.log(authenticatedUser);

        const token = createToken(authenticatedUser._id)
        res.status(200).json({ accessToken: token })

    } catch(err) {
        const errResponse = handleAuthErrors(err)
        console.log(errResponse);
        res.status(400).json(errResponse)
    }
}

async function getCurrentUser(req, res) {
    const { id: userId } = req.user

    try {
        const user = await User.findOne({ _id: userId }).select("name email")

        if(user === null) {
            res.status(404).json({ message: "User Not Found" })
        }
        res.status(200).json(user)

    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err })
    }
}

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })
}

function handleAuthErrors(err) {
    if(err.code === 11000) {
        return { email: "Email Already Exists"}
    }

    if(err.name === "ValidationError") {
        let validationErrors = {}
        const { name, email, password } = err.errors

        if("name" in err.errors) {
            validationErrors.name = name.message
        }

        if("email" in err.errors) {
            validationErrors.email = email.message
        }

        if("password" in err.errors) {
            validationErrors.password = password.message
        }

        return validationErrors
    } else {
        return { message: err }
    }
}

module.exports = { registerUser, loginUser, getCurrentUser }