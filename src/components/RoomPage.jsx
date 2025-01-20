import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socket_context } from '../context/socketContext';
import peer from "../service/peer.js"
import ReactPlayer from 'react-player';
import { user_eamil_context } from '../context/myemail_context';

const RoomPage = () => {
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [remoteEmail, setRemoteEmail] = useState(null);
    const param = useParams();
    const [showReveive , setShowReceive] = useState(false)
    const { socket } = useContext(socket_context);
    const { myEmail } = useContext(user_eamil_context);

    const handleNewUserJoin = useCallback(async ({ email }) => {
        try {
            console.log("sharing of offer")
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
            setMyStream(stream)
            const offer = await peer.createOffer()
            socket.emit('send-offer', { email, offer });
        } catch (error) {
            console.error(error);
        }
    }, [socket]);

    const handleReceiveOffer = useCallback(async ({ email, offer }) => {
        try {
            setRemoteEmail(email)
            console.log("receive offer")
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
            setMyStream(stream)
            const answer = await peer.createAnswer(offer)
            console.log("send answer")
            socket.emit('send-answer', { email, answer });
        } catch (error) {
            console.error(error);
        }
    }, [socket]);

    const handleReceiveAnswer = useCallback(async ({ email, answer }) => {
        try {
            setRemoteEmail(email)
            console.log("receive answer")
            await peer.receiveAnswer(answer)
            
        } catch (error) {
            console.error(error);
        }
    }, [peer]);

    const handleNegoReceiveOffer = useCallback(async({offer,email})=>{
        console.log("nego offer receiving")
        const answer = await peer.createAnswer(offer)
        console.log("nego answer sending")
        socket.emit("nego:send:ans",{answer,email})
    })

    const handleNegoReceiveAnswer = useCallback(({answer,email})=>{
        console.log("nego answer receiving")
        peer.peer.setRemoteDescription(new RTCSessionDescription(answer))
    }) 

    useEffect(() => {
        socket.on("new-user-join-room", handleNewUserJoin);
        socket.on("receive-offer", handleReceiveOffer);
        socket.on("receive-answer", handleReceiveAnswer);
        socket.on("nego:receive:offer",handleNegoReceiveOffer);
        socket.on("nego:receive:ans",handleNegoReceiveAnswer);

        return () => {
            socket.off("new-user-join-room", handleNewUserJoin);
            socket.off("receive-offer", handleReceiveOffer);
            socket.off("receive-answer", handleReceiveAnswer);
            socket.off("nego:receive:offer",handleNegoReceiveOffer);
            socket.off("nego:receive:ans",handleNegoReceiveAnswer);
        };
    }, [socket, handleNewUserJoin, handleReceiveOffer, handleReceiveAnswer]);

    const handleNegotiation = useCallback(async () => {
        const offer = await peer.createOffer()
        console.log("nego offer sending")
        console.log(offer)
        socket.emit('nego:send:offer',{offer,email: remoteEmail})
    }, [peer,remoteEmail]);

    const handleTracks = useCallback((event)=>{
        const stream = event.streams[0]
        setShowReceive(true)
        setRemoteStream(stream)
    })
 
    useEffect(() => {
        if (peer && peer.peer) {
            console.log("event was added")
            peer.peer.onnegotiationneeded = handleNegotiation;
            peer.peer.ontrack = handleTracks
            return () => {
                peer.peer.onnegotiationneeded = null;
                peer.peer.ontrack = null;
            };
        }
    }, [peer, handleNegotiation]);

    const handleMakeCall = useCallback(() => {
        peer.sendMyStream(myStream)
    }, [myStream]);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Welcome to Room {param.roomid}</h1>
            {!showReveive && <button onClick={handleMakeCall}>Make Call</button>}
            {showReveive && <button onClick={handleMakeCall}>Accept Call</button>}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {myStream && (
                    <div style={{ marginRight: '20px' }}>
                        <h3>Your Stream</h3>
                        <ReactPlayer
                            url={myStream}
                            playing
                            muted
                            width="400px"
                            height="300px"
                        />
                    </div>
                )}
                {remoteStream && showReveive  && (
                    <div>
                        <h3>Remote Stream</h3>
                        <ReactPlayer
                            url={remoteStream}
                            playing
                            width="400px"
                            height="300px"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomPage;
