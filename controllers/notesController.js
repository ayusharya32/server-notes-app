const Note = require('../models/Note')

async function getAllNotes(req, res) {
    const { id: userId } = req.user
    
    try {
        const notes = await Note.find({ userId: userId }).sort([["createdAt", -1]]).select("-__v")
        res.status(200).json(notes)
        
    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err })
    }
}

async function addNote(req, res) {
    const { id: userId } = req.user
    const { title, description } = req.body

    if(title === undefined || description === undefined) {
        res.status(400).json({ message: "Request Body Parameters (title, description) not provided" })
    }

    try {
        const note = await Note.create({ userId, title, description })
        
        res.status(201).json({ 
            message: "Note Created Successfully",
            note
        })

    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err })
    }
}

async function updateNote(req, res) {
    const { id: userId } = req.user
    const { noteId, title, description } = req.body

    if(noteId === undefined || title === undefined || description === undefined) {
        return res.status(400).json({ message: "Required Body Parameters (noteId, title, description) not provided" })
    }

    try {   
        const note = await Note.findOne({ _id: noteId })

        if(note === null) {
            return res.status(404).json({ message: "No Note found with provided note id" })
        }

        if(note.userId !== userId) {
            return res.status(403).json({ message: "Rights of this document does not belong to authorized user" })
        }

        note.title = title.trim()
        note.description = description.trim()
        note.createdAt = Date.now()

        await Note.replaceOne({ _id: noteId }, note)
        res.status(200).json({ message: "Note Updated Successfully", note })

    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err })
    }
}

async function deleteNote(req, res) {
    const { id: userId } = req.user
    const noteId = req.params.noteId

    try {
        const note = await Note.findOne({ _id: noteId })

        if(note === null) {
            return res.status(404).json({ message: "No Note found with provided note id" })
        }

        if(note.userId !== userId) {
            return res.status(403).json({ message: "Rights of this document does not belong to authorized user" })
        }

        await Note.deleteOne({ _id: noteId })
        res.status(200).json({ message: "Note Deleted Successfully", note })

    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err })
    }
}

async function searchNotes(req, res) {
    const { id: userId } = req.user
    let { searchQuery } = req.query

    if(searchQuery === undefined) {
        return res.status(400).json({ message: "Search Query not provided as query parameter" })
    }

    searchQuery = searchQuery.trim()

    try {
        const searchQueryRegex = new RegExp(searchQuery, "i")
        console.log(searchQueryRegex);

        const resultNotes = await Note.find().or([
            { userId: userId, title: searchQueryRegex },
            { userId: userId, description: searchQueryRegex }
        ])

        res.status(200).json(resultNotes)

    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err })
    }
}

module.exports = { getAllNotes, addNote, updateNote, deleteNote, searchNotes }