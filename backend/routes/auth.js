const express = require("express")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const jwt = require('jsonwebtoken')
const { CreateToken } = require("../utils/config")
const {protectedRoute} = require('../middleware/protectedRoute')

const router = express.Router()

router.post("/register",async(req,res)=>{
     const {name,password,email,username} = req.body
     const isPasswordValid = validator.isStrongPassword(password)
     const isEmailValid = validator.isEmail(email)

     if(!isEmailValid) return res.status(400).json({success:false,message:"Email is not valid"})
  
     if(username.length < 3) return res.status(400).json({success:false,message:"Username must be at least 3 characters"})
  
     if(!isPasswordValid) return res.status(400).json({success:false,message:"Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character"})
    
        const existingEmail = await User.findOne({email})
        if(existingEmail) return res.status(409).json({success:false,message:"Email already exists"})
     
        const existingUsername = await User.findOne({username})
        if(existingUsername) return res.status(409).json({success:false,message:"Username already exists"})

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newuser = new User({name,username,email,password:hashedPassword})
       const user =  await newuser.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

})


router.post("/login",async(req,res)=>{
    const {email,password} = req.body

    try {
        const user = await User.findOne({email})

        if (!user) return res.status(404).json({message:"Email or Password is incorrect"})

        const validuser = await bcrypt.compare(password,user.password)
        if(!validuser) return res.status(404).json({message:"Email or Password is incorrect"})

        CreateToken(user._id,res)
        const {password:userpassword,updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
  

})

router.post('/logout',async(req,res)=>{
    try {
      res.clearCookie("social")
      res.status(200).json({success:'true',message:'Logged out successfully'})
    } catch (error) {
      console.log(error)
      res.status(500).json({success:false,message:"Internal Server Error"})
    }
})

router.get('/checkAuth',protectedRoute,(req,res)=>{
    try {
       res.status(200).json({success:true,user:req.user})
    } catch (error) {
       console.log(error)
       res.status(500).json({success:false,message:"Internal Server Error"})
    }
 })

module.exports = router