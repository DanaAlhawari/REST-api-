const express = require('express');
const router = express.Router()
const Thread = require('../model/thread')
const Reply = require('../model/replies')
const Like = require('../model/like')
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
// Hämta all tråder  
router.get('/', (req, res) => {
        const threads = Thread.find().then((threads) => {
            res.json(threads)
        })
    
})
//Lägger till en tråd  
router.post('/',passport.authenticate('basic',{session:false}), async(req, res) => {
    let thread = new Thread(req.body);
    thread.save()
    res.status(200).json(thread);
})
//Hämtar en specifik tråd
router.get('/:threadId', async (req, res) => {
    let thread
    try {
         thread = await Thread.findById(req.params.threadId)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    if(thread) {
        res.status(200).json(thread)
    } else {
        res.status(404).send("Thread not found")
    }
    
})

//Hämtar svar för en tråd 
router.get('/:threadId/replies', async (req, res) => {
    let thread
    try {
       thread = await Thread.findById(req.params.threadId).populate("replies")
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    if (thread) {
       res.status(201).json(thread.replies)
    }
    else {
        res.status(404).send("Not found");
    }
    
})
//Lägger till ett svar i en tråd 
router.post('/:threadId/replies',passport.authenticate('basic',{session:false}), async(req, res) => {
  let thread
    try {
       thread = await Thread.findById(req.params.threadId)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
    if (thread) {
        req.body.time = new Date();
        const reply = new Reply(req.body);
        thread.replies.push(reply);
        await reply.save();
        await thread.save();
        res.status(200).send("answer added").end()
    } else {
        res.status(404).send("Not found");
    }

})
//Lägger till en like till ett svar 
router.post('/:threadId/replies/:replyId/like',passport.authenticate('basic',{session:false}), async(req, res) => {
    let reply
    try {
       reply = await Reply.findById(req.params.replyId)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
    if (reply) {
        const like = new Like() 
        await like.save()
        reply.likes.push(like) 
        await reply.save()
        res.status(200).send("like added")
    } else {
        res.status(404).send("Not found");
    }

})
//Tar bort en like till ett svar 
router.delete('/:threadId/replies/:replyId/like/:likeId',passport.authenticate('basic',{session:false}), async (req, res) => {
    
    try {
       await Like.findByIdAndDelete(req.params.likeId)
       
         res.status(200).json({ message: 'like deleted'});

    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})
  
// Methods for me 
//Ta bort en post by id  ==>för mig
router.delete('/:id' , async(req, res) => {
    try {
        await Thread.findById(req.params.id).deleteOne();
        res.json({ message: 'Deleted post'});
    } catch (err) {
        res.status(500).json({message: err.message })
    }
})
//*** ==>för mig
router.delete('/:id/replies' , async(req, res) => {
    try {
        await Reply.findById(req.params.id).deleteOne();
        res.json({ message: 'Deleted svar'});
    } catch (err) {
        res.status(500).json({message: err.message })
    }
})
//hämtar like >>>för mig
router.get('/:id/replies/:id/like', async (req, res) => {
     let reply
    try {
       reply = await Reply.findById(req.params.id)//.populate("likes")
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    if (reply) {
      res.status(202).json(reply.likes)
    }
    else {
        res.status(404).send("Not found");
    }
})


 module.exports = router;