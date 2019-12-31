import { Signal } from './interface';
import Socket from './Socket';
import logger, { LogLevel } from './Logger';

export class MiddlewareFunction {
    private middlewareFunctions: Function[] = [];
    constructor(fn?: Function) { fn && this.use(fn); }
    use(fn: Function) { this.middlewareFunctions.push(fn); };
    execute(data: any) { this.middlewareFunctions.forEach(fn => fn(data)); }
}

interface Config {
    loglevel?: LogLevel
}

export default class SignallingServer {
    public socket: Socket;
    public onAnswer = new MiddlewareFunction();
    public onOffer = new MiddlewareFunction();
    public onCandidate = new MiddlewareFunction();
    public onRejection = new MiddlewareFunction();
    public onAcceptingConnections = new MiddlewareFunction();
    public onConnectionRequest = new MiddlewareFunction();

    constructor(url: string, config?: Config) {
        // Set the log level
        config && config.loglevel && (logger.logLevel = config.loglevel)
        this.socket = new Socket(url);
        this.socket.on('connect', () => logger.log('Successfully connected to the server', this.socket.id));
    }

    onMetadata(data: Signal) { logger.log(data); }

    get socketID(): string {
        return this.socket.id;
    }

    protected signal(data: Signal): void {
        const { desc, candidate, msg } = data;
        if (desc) {
            if (desc.type === "offer") {
                this.onOffer.execute(data);
                logger.log('[SIGNALING SERVER]: received offer')
            }
            else if (desc.type === "answer") {
                this.onAnswer.execute(data);
                logger.log('[SIGNALING SERVER]: received answer')
            }
        } else if (candidate) {
            this.onCandidate.execute(data);
            logger.log('[SIGNALING SERVER]: received candidate')
        }
        if (msg) {
            if (msg.type === "reject") {
                this.onRejection.execute(data);
                logger.log('[SIGNALING SERVER]: received rejection');
            }
            if (msg.type === "accepting_connections") {
                this.onAcceptingConnections.execute(data);
                logger.log('[SIGNALING SERVER]: accepting connections');
            }
            if (msg.type === "connection_request") {
                this.onConnectionRequest.execute(data);
                logger.log('[SIGNALING SERVER]: connection request');
            }
            if (msg.type === "metadata") {
                this.onMetadata(data);
                logger.log('[SIGNALING SERVER]: Metadata received', msg.data)
            }
        }
    }

    setupSocketListeners() {
        this.socket.on('signal', (signal: Signal) => this.signal(signal));
    }

    createRoom(name: string) {
        this.socket.emit('new_room', name);
    }

    send(data?: any, event?: string): void {
        this.socket.emit(event || 'signal', data);
    }
}