class PeerConnectionService {
    constructor() {
        this.peer = this.initializePeerConnection();
    }

    initializePeerConnection() {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ],
                },
            ],
        });
        return peer;
    }

    async createOffer() {
        try {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    }

    async createAnswer(offer) {
        try {
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    }

    async receiveAnswer(answer) {
        try {
            await this.peer.setRemoteDescription(answer);
        } catch (error) {
            console.error("Error setting remote answer:", error);
        }
    }

    sendMyStream(myStream) {
        try {
            const tracks = myStream.getTracks();
            console.log("adding tracks in peer connection")
            tracks.forEach(track => {
                this.peer.addTrack(track, myStream);
            });
        } catch (error) {
            console.error("Error sending stream:", error);
        }
    }

    closeConnection() {
        if (this.peer) {
            this.peer.close();
            console.log("Peer connection closed.");
        }
    }
}

export default new PeerConnectionService()
