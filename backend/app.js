require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")
const commentRoute = require('./routes/comments')
const friendsRoute = require('./routes/friends')
const chatroute = require('./routes/chats')
const messageroute = require('./routes/messages')
const { protectedRoute } = require("./middleware/protectedRoute")
const path = require('path')

const app = express()

const NODE_ENV = process.env.NODE_ENV

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connected to the database successfully'))
.catch(()=>console.log('Error connecting to the database'))


app.use(express.json())
app.use(cookieParser())

//routes
app.use("/api/users",protectedRoute ,userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts", protectedRoute,postRoute)
app.use("/api/comments",protectedRoute ,commentRoute)
app.use("/api/friends", protectedRoute,friendsRoute)
app.use("/api/chat", protectedRoute,chatroute)
app.use("/api/messages", protectedRoute,messageroute)

if(NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))

  app.get('*',(req,res)=>{
      res.sendFile(path.resolve(__dirname,'../frontend/dist', 'index.html'))
  })
}


const PORT = process.env.PORT
const server = app.listen(PORT,()=>console.log(`Server is up and running on ${PORT}`))

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173'
  },
});

let onlineUsers = [];

const addUser = (userId,socketId)=>{
  const userExists = onlineUsers.find(user=>user.userId === userId)
  if(!userExists){
      onlineUsers.push({userId,socketId})
  }
}

const getUser = (userId) => {
  return onlineUsers.find(user => user.userId === userId);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

io.on('connection', (socket) => {
 
 
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers); 
  });

  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers); 
  });
});
