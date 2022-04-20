const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');
const JWT_SECRET = "ameer$#@hamza"



//Route 1: create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 5 }),

] , async (req,res)=>{
    // if there are errors, return bad request and ther errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }
    // check weather user with same email exist already
    try {
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Sorry a user with this email already exists"})
        }
        //Password decription
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // res.json(user);
        res.json({authToken});

        } catch(error){
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
})

// Route:2 Autheniticate a user using: POST "/api/login/createuser". No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req,res)=>{
    //if there are error, return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({error:"Please try to logins with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to logins with correct credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})


// Route: 3 Get logged in user details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser ,async (req,res)=>{
try {
    userId = req.user.id;
    const user = await User.findById(userId).select('password')
    res.send(user);
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
}
})
module.exports = router;