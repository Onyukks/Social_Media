const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
       type:String,
       required:true,     
    },
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        min:6,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    profilePic:{
        type:String,
        default:"",
    },
    coverPic:{
        type:String,
        default:"",
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)