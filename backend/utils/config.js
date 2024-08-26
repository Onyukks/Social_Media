const jwt = require('jsonwebtoken')
const env = process.env

const CreateToken = (userid,res)=>{
    const token = jwt.sign({userid},env.SECRET_KEY)

    res.cookie("social",token,{
        httpOnly: true,
        sameSite : "strict",
        secure: env.NODE_ENV !== 'development'
    })

    return token
}

module.exports={
    CreateToken
}