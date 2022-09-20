const express = require('express');
const socket = require('socket.io');
const cors = require('cors');


const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
const server = app.listen(PORT,()=>{
    console.log(`server is listening on PORT ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

const io = socket(server,{
    cors:{
        origin:'*',
        method:['GET','POST']
    }
});


let count = 0;
let logCount = (event)=>{
    ++count;
    console.log(`event ${event} run num ${count}`);
}
io.on('connection',socket=>{
    console.log(`user ${socket.id} connected`);
    logCount('connection');
    socket.emit("me", socket.id);

	socket.on("disconnect", () => {
        logCount('disconnect');
		socket.broadcast.emit("callEnded")
	});

    socket.on("endCall", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signal, from, name }) => {
        logCount('callUser');
        io.to(userToCall).emit("callUser", { signal: signal, from, name });
	});

	socket.on("answerCall", (data) => {
        logCount('answerCall');
        
        io.to(data.to).emit("callAccepted", data.signal)
	});
})