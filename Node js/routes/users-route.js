const express = require('express');
const router = express.Router();
const User = require('../model/users');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
//passport
passport.use(new BasicStrategy(
    function (username, password, done) {
        User.findOne({ username}, function (err, user) {
            if (err) { return done(err) }
            if (!user || password !== user.password) { return done(null, false) }
            return done(null, user)
})
    }
))

// Hämtar alla users
router.get('/',  async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Lägger user
router.post('/',  async(req, res) => {
    const user =  new User({
        username: req.body.username,
        password: req.body.password
    })
     try {
         const newUser = await user.save()
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message })

    }
})
//Hämtar en specifik user
router.get("/:id",async(req, res) => {
  
    try {
        let user =  await User.findById(req.params.id)
        res.json(user)
    } catch (e) {
        res.status(400).send("Bad request")
    }

})
//delete user 
router.delete("/:id",passport.authenticate('basic',{session:false}), async(req, res) => {
     try {
        await User.findById(req.params.id).deleteOne();
        res.json({ message: 'user deleted'});
    } catch (err) {
        res.status(500).json({message: err.message })
    }
})
module.exports = router;