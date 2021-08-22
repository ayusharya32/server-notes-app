const express = require('express')
const { authenticateUser } = require('../utils/AuthUtils')
const router = express.Router()
const { getAllNotes, addNote, updateNote, deleteNote, searchNotes } = require('../controllers/notesController')

router  
    .route("/")
    .get(authenticateUser, getAllNotes)

router  
    .route("/")
    .post(authenticateUser, addNote)

router  
    .route("/")
    .put(authenticateUser, updateNote)

router  
    .route("/:noteId")
    .delete(authenticateUser, deleteNote)

router
    .route("/search")
    .get(authenticateUser, searchNotes)

module.exports = router