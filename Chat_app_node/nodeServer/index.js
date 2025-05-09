// Node server socket io
const io = require('socket.io')(3000,{
    cors:{
        origin: "http://127.0.0.1:5500", // Allow requests from this origin
        methods: ["GET", "POST"],
        credentials: true
    }
});
const users={};
io.on('connection',socket=>{
    socket.on('new-user-joined',username=>{
        console.log("New User:",username)
       users[socket.id]=username; 
       socket.broadcast.emit('user-joined',username);


    })

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,username:users[socket.id]})
    })

socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
})
});

