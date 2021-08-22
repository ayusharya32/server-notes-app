const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please add a userId for note"]
    },
    title: {
        type: String, 
        trim: true,
        required: [true, "Please add a title for note"]
    },
    description: {
        type: String, 
        trim: true,
        required: [true, "Please add description for note"]
    },
    createdAt: {
        type: Number,
        default: Date.now
    }
})

module.exports = mongoose.model("Note", NoteSchema)