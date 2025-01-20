import { createServer } from "http";
import { Server } from "socket.io";

const app = createServer();
const port = 3001;

const io = new Server(app, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
  },
});

let emailToSocketid = new Map();
let socketidToEmail = new Map();

io.on('connection', (socket) => {

  socket.on('join-room', (message) => {
    const { myEmail, roomid } = message;
    emailToSocketid.set(myEmail, socket.id);
    socketidToEmail.set(socket.id, myEmail);
    console.log(socketidToEmail)
    console.log(emailToSocketid)
    socket.join(roomid);
    socket.to(roomid).emit('new-user-join-room', { email :myEmail });
  });

  socket.on('send-offer', ({ email, offer }) => {
    const socketid = emailToSocketid.get(email);
    const offerFrom = socketidToEmail.get(socket.id);
    if (socketid) {
      console.log(socketidToEmail.get(socketid))
      socket.to(socketid).emit('receive-offer', { email: offerFrom, offer });
    } else {
      console.error(`Socket ID not found for email: ${email}`);
    }
  });

  socket.on('send-answer', ({ email, answer }) => {
    const socketid = emailToSocketid.get(email);
    const answerFrom = socketidToEmail.get(socket.id);

    if (socketid) {
      socket.to(socketid).emit('receive-answer', { email: answerFrom, answer });
    } else {
      console.error(`Socket ID not found for email: ${email}`);
    }
  });

  socket.on('disconnect', () => {
    console.log("disconnected: ",socketidToEmail.get(socket.id))
    const email = socketidToEmail.get(socket.id);
    if (email) {
      emailToSocketid.delete(email);
    }
    socketidToEmail.delete(socket.id);

  });

  socket.on("nego:send:offer",({offer,email})=>{
    const from = socketidToEmail.get(socket.id)
    const socketid = emailToSocketid.get(email)
    console.log(email)
    if(socketid){
      console.log("hello nego process start")
      socket.to(socketid).emit('nego:receive:offer',{email:from,offer})
    }
  })

  socket.on("nego:send:ans",({answer,email})=>{
    const from = socketidToEmail.get(socket.id)
    const socketid = emailToSocketid.get(email)
    console.log("answer: ",answer)
    socket.to(socketid).emit("nego:receive:ans",{email:from,answer})
  })

});


app.listen(port, () => {
  console.log("Server is running at", port);
});
