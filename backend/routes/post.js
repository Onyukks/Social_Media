const express = require('express')
const Post = require("../models/post")
const User = require("../models/user")
const Friendship = require('../models/Friendships')
const router = express.Router()
const {requireAuth} = require('../middleware/protectedRoute')

// router.use(requireAuth)

//create a post
router.post("/",async(req,res)=>{
    const post = new Post(req.body)
    try {
        const newpost = await post.save()
        const getnewpost = await Post.findById(newpost._id).populate('userID', 'name username profilePic')
        res.status(201).json(getnewpost)
    } catch (error) {
        res.status(500).json(error)
    }
})

//update a post
router.put('/:id',async(req,res)=>{
     try {
        const post = await Post.findById(req.params.id)
        if(post.userID.toString() !== req.body.userID) return res.status(403).json({message:"You cannot edit this post"})
        
        await post.updateOne({$set:req.body})
        const updatedpost = await Post.findById(post._id).populate('userID', 'name username profilePic')
        res.status(200).json(updatedpost)
     } catch (error) {
        res.status(500).json(error)
     }
})

//delete a post
router.delete('/:id',async(req,res)=>{
    try {
       const post = await Post.findByIdAndDelete(req.params.id)
       res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
       res.status(500).json(error)
    }
})

//like/unlike a post
router.put("/:id/likes",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post.likes.includes(req.body.userID)){
         await post.updateOne({$push:{likes:req.body.userID}})
         res.status(200).json("This post has been liked")
        }else{
          await post.updateOne({$pull:{likes:req.body.userID}})
          res.status(200).json("This post has been unliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get a post
router.get('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id).populate('userID', 'name username profilePic');
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get Timeline Posts
router.get('/timeline/all/:userID', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userID);

        // Get current user's posts
        const userPosts = await Post.find({ userID: currentUser._id }).populate('userID', 'name username profilePic').sort({ createdAt: -1 });

        // Get friends' IDs
        const friendships = await Friendship.find({
            $or: [{ user1: currentUser._id }, { user2: currentUser._id }]
        });

        const friendIDs = friendships.map(friendship => 
            friendship.user1.equals(currentUser._id) ? friendship.user2 : friendship.user1
        );

        // Get friends' posts
        const friendPosts = await Post.find({ userID: { $in: friendIDs } }).populate('userID', 'name username profilePic').sort({ createdAt: -1 });

        // Combine and return posts
        const allPosts = userPosts.concat(friendPosts).sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json(error);
    }
});


// Get User Posts
router.get('/userposts/all/:userID', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userID);
        const userPosts = await Post.find({ userID: currentUser._id }).populate('userID', 'name username profilePic').sort({ createdAt: -1 });
        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router