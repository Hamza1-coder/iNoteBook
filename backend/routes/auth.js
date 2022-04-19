const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { body, validationResult } = require('express-validator');

// create a user using: POST "/api/auth". does not require auth
router.post('/',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 5 }),

] , (req,res)=>{
//    console.log(req.body);s
//    const user = User(req.body);
//    user.save();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user))
      .catch(err => {console.log(err)
        res.json({error: 'Please enter the unique value for email',
                  message: err.message})
    });
})

module.exports = router;