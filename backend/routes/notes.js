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
// Route 3: Update existing notes: POST "/api/notes/updatenote".
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    const { title, description, tag} = req.body;
    //create a new note object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // find teh note to be updated and udate it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});

})
module.exports = router;