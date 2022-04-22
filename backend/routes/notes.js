const express = require('express');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');
const Notes = require('../models/Notes'); 
const { body, validationResult } = require('express-validator');





// Route 1: Get all the notes: GET "/api/notes/fetchallnotes".
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 2: Add new notes: POST "/api/notes/addnotes".
router.post('/addnotes',fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Valid description must be at least 5 characters').isLength({ min:5 }),
], async (req,res)=>{
    try {
        const {title, description, tag} = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
});

module.exports = router;