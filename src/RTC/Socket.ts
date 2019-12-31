import EventEmitter from 'events';

interface SocketMessage {
    type: string;
    data?: any;
}

export default class Socket extends EventEmitter {
    private socket: WebSocket;

    constructor(public url: string) {
        super();
        this.socket = new WebSocket(url);
        this.socket.onmessage = (event: MessageEvent) => this.onmessage(event);
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