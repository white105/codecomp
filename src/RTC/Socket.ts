import EventEmitter from 'events';
import generateUniqueID from './generateUniqueID';

interface SocketMessage {
    type: string;
    data?: any;
}

export default class Socket extends EventEmitter {
    private socket: WebSocket;
    public id: string;

    constructor(public url: string) {
        super();
        this.socket = new WebSocket(url);
        this.socket.onmessage = (event: MessageEvent) => this.onmessage(event);
        this.id = generateUniqueID();
    }

    private onmessage(event: MessageEvent) {
        const msg = JSON.parse(event.data);
        const { type, data } = msg;
        this.emit(type, data);
    }

    public send(msg: SocketMessage) {
        const stringifyMessage = JSON.stringify(msg);
        this.socket.send(stringifyMessage);
    }
}