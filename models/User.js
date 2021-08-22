const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

function validateName(name) {
	const regex = /^[a-zA-Z ]*$/
	return regex.test(name)
}

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/
	return regex.test(password)
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true,
        minlength: [4, "Name should contain at least 4 characters"], 
        maxlength: [30, "Name should not contain more than 30 characters"],
        validate: [validateName, "Please enter a valid name"],
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        validate: [isEmail, "Please enter a valid email"],
        required: [true, "Please add an email"]
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, "Password should have at least 6 characters"],
        validate: [validatePassword, "Password should have at least one lowercase, one uppercase and a special character"],
        required: [true, "Please add a password"]
    }
})

UserSchema.pre("save", async function(next) {
    if(this.isModified(this.password)) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email: email })

    if(user) {
        const authResult = await bcrypt.compare(password, user.password)
        
        if(authResult) {
            return user
        }
        throw('Incorrect Password')

    } else {
        throw('Email not found')
    }
}

module.exports = mongoose.model("User", UserSchema)