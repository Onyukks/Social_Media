const express = require('express')
const Comment = require('../models/Comments')
const router = express.Router()


//Get post comments
router.get('/:id',async(req,res)=>{
    try {
        const comments = await Comment.find({
            postId:req.params.id
        }).sort({createdAt:-1}).populate('user', 'name username profilePic');
        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json("Internal Server Error")
    }
})

//Post a comment
router.post('/:id',async(req,res)=>{
    const {userId,commentText} = req.body
    try {
        const comment = new Comment({
            postId:req.params.id,
            user:userId,
            commentText
        })
      const newComment =await comment.save()
      const populatedComment = await Comment.findById(newComment._id).populate('user', 'name username profilePic');
      res.status(200).json(populatedComment)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

module.exports = router
