const mongoose = require('mongoose')

const commentschema = new mongoose.Schema({
    postId:{
        type:String,
        required:true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    commentText:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Comment',commentschema)