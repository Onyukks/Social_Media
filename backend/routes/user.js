const express = require("express")
const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require("../models/user")
const router = express.Router()
const Chat = require('../models/Chat')


//update a user
router.put("/:id",async(req,res)=>{
    if(req.body.userID  === req.params.id || req.body.isAdmin){
        const {email,password,city,name,desc,username,profilePic,coverPic} = req.body
        if(password){
            const isValidPassword = validator.isStrongPassword(password)
            if(!isValidPassword) return res.status(400).json({message:"Password not strong enough"})
            try {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password,salt)
                await User.findByIdAndUpdate(req.params.id,{password:hash})
            } catch (err) {
                res.status(500).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{email,city,name,desc,username,profilePic,coverPic})
            const updateduser = await User.findById(user._id)
            const {password,updatedAt,...other} = updateduser._doc
            res.status(200).json(other)
        }catch(error){
            res.status(500).json(err)
        }
    }else{
        return res.status(403).json({message:"You can only update your own account"})
    }
})

//delete a user
router.delete("/:id",async(req,res)=>{
    if(req.body.userID  === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({message:"Deleted Successfully"})
        }catch(error){
            res.status(500).json(err)
        }
    }else{
        return res.status(403).json({message:"You can only delete your own account"})
    }
})

//Get A User
router.get("/:id",async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
})

//Get All Users
router.get('/all/getusers',async(req,res)=>{
    try {
        const users = await User.find({}).select('_id name username profilePic')
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json(error)
        console.log(error)
    }
})


module.exports = router