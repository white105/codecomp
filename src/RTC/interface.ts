export type Listener = (...args: any[]) => void

export interface SignalMessageData {
    /**
     * socket id of the other user assigned by the server
     */
    readonly s_id?: string;
    /**
     * current room of the caller/callee before initiating/joining the call
     */
    currentRoom?: string;
    /**
     * Information of the webrtc room
     */
    room?: {
        conferenceRoom: string;
        clients: string[];
    };
    /**
     * Socket id of the recepient to be used by the signalling server
     */
    to?: string;
}

export interface SignalMessageOtherInfo {
    peerID: string;
}

export interface SignalMessage {
    type: string;
    data?: SignalMessageData;
    otherInfo?: SignalMessageOtherInfo;
}

export interface Signal {
    desc?: RTCSessionDescription;
    candidate?: RTCIceCandidate;
    msg?: SignalMessage
}

type CallEvents = "stream" | "reject";

export interface Call {
    answer: (stream: MediaStream) => void;
    reject: () => void;
    on: (event: CallEvents, listener: Listener) => void;
}