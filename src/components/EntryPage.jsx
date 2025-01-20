import React, { useContext, useState } from 'react';
import { socket_context } from '../context/socketContext';
import { useNavigate } from 'react-router-dom';
import { user_eamil_context } from '../context/myemail_context';

const EntryPage = () => {
    const { socket } = useContext(socket_context);
    const {myEmail, setEmail} = useContext(user_eamil_context);
    const [roomid, setRoomId] = useState('');
    const navigate = useNavigate();
    const handleJoinRoom = () => {

        if (myEmail && roomid) {
            if (socket) {
                socket.emit('join-room', { myEmail, roomid });
                navigate(`/room/${roomid}`);
            } else {
                console.error('Socket is not initialized');
            }
        } else {
            console.log('Please provide both email and room ID');
        }
    };

    return (
        <>
            <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                value={myEmail}
            />
            <input
                type="text"
                placeholder="Enter Room Id"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomid}
            />
            <button onClick={handleJoinRoom}>Enter Room</button>
        </>
    );
};

export default EntryPage;
