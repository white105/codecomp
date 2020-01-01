import SignalingServer from './SignalingServer';
import { EventEmitter } from 'events';
import generateUniqueID from './generateUniqueID'
import { Signal, Listener, Call, SignalMessage } from './interface';
import logger, { LogLevel } from './Logger';


interface Config {
    loglevel?: LogLevel;
    rtc: RTCConfiguration
}

/**
 * @example
 * const rtc = new RTC({rtcConfig, logLevel}, signalling, user_id_registered_on_server)
 * rtc.call(mediastream)
 */
export default class RTC extends EventEmitter {
    private peer: RTCPeerConnection;
    private polite = true;
    private metadata = {};
    public Call: Call;
    public remoteStream: MediaStream = new MediaStream();
    public peerOtherInfo = {};
    public peerID = generateUniqueID();

    constructor(config: Config, public signaling: SignalingServer, public otherInfo = {}, public talkTo: string) {
        super()
        if (!this.signaling) throw Error('No signaling server provided. Pass it as a second argument to the constructor');

        // Set the log level
        config && config.loglevel && (logger.logLevel = config.loglevel)
        // LOG PREFIX
        logger.logPrefix = "[RTC]: "

        this.peer = new RTCPeerConnection(config.rtc);

        this.signaling.setupSocketListeners()
        this.setupRTCConnection();
        this.setupSignalling();
    }

    /**
     * Setup the RTC event handlers
     * Handlers includes, onnegotiationneeded, onicecandidate, ontrack, oniceconnectionstatechange, onsignalingstatechange
     * onicegatheringstatechange
     */
    private setupRTCConnection() {

        // 'negotiationneeded' handler
        this.peer.onnegotiationneeded = async () => {
            const offer = await this.peer.createOffer();

            // If the signallingState is unstable then return and do nothing
            if (this.peer.signalingState !== "stable") return;

            try {
                await this.peer.setLocalDescription(offer);

                const sendObject = {
                    desc: this.peer.localDescription,
                    msg: { metadata: this.metadata, peerID: this.peerID }
                }

                this.signaling.send(sendObject)

            } catch (error) {
                logger.error(error);
            }
        }

        // 'icecandidate' handler
        this.peer.onicecandidate = async ({ candidate }) => {
            this.signaling.send({ candidate, msg: { metadata: this.metadata, peerID: this.peerID } })
        }

        // 'track' handler
        this.peer.ontrack = event => {
            logger.log('[ONTRACK]:', event);
            this.remoteStream = new MediaStream([...this.remoteStream.getTracks(), ...event.streams[0].getTracks()])
            this.emit("stream", { stream: this.remoteStream, otherInfo: this.peerOtherInfo });
        }

        // 'oniceconnectionstatechange' handler
        this.peer.oniceconnectionstatechange = async event => {
            logger.log('[oniceconnectionstatechange]: ', event);
            logger.log('[oniceconnectionstatechange 2]: ', this.peer.iceConnectionState);
            if (this.peer.iceConnectionState === "failed") {
                logger.log('[ATTEMPTING RESTART]');
                const offer = await this.peer.createOffer({ iceRestart: true });

                // If the signallingState is unstable then return and do nothing
                if (this.peer.signalingState !== "stable") return;

                try {
                    await this.peer.setLocalDescription(offer);
                    this.signaling.send({
                        desc: this.peer.localDescription,
                        msg: { metadata: this.metadata, peerID: this.peerID }
                    })
                }
                catch (error) {
                    logger.error(error);
                }
            }
        }

        // 'signalingstatechange' handler
        this.peer.onsignalingstatechange = event => {
            logger.log('[signalingstatechange]: ', event);
            logger.log('[signalingstatechange 2]: ', this.peer.signalingState);
        }

        // 'icegatheringstatechange' handler
        this.peer.onicegatheringstatechange = event => {
            logger.log('[icegatheringstatechange]: ', event);
            logger.log('[icegatheringstatechange 2]: ', this.peer.iceGatheringState);
        }
    }

    /**
     * Setup the signalling server middleware functions
     */
    private setupSignalling() {
        // 'answer' handler
        this.signaling.onAnswer.use((data: Signal) => {
            if (data.msg.data.s_id !== this.talkTo) return;

            // Store info sent by the other peer
            this.peerOtherInfo = data.msg.otherInfo;

            this.emit("connected", data.desc);
            this.peer.setRemoteDescription(data.desc)
        });

        // 'offer' handler
        this.signaling.onOffer.use((data: Signal) => {
            if (data.msg.data.s_id !== this.talkTo) return;

            this.Call = {
                answer: async (stream: MediaStream) => {

                    if (this.peer.signalingState !== "stable") {
                        if (!this.polite) return;
                        try {
                            await Promise.all([
                                this.peer.setLocalDescription({ type: "rollback" }),
                                this.peer.setRemoteDescription(data.desc)
                            ])
                            logger.log('Rolled back');
                        } catch (err) {
                            logger.error('Error rolling back', err)
                        }
                    } else {
                        try {
                            // Store info sent by the other peer
                            this.peerOtherInfo = data.msg.otherInfo;
                            logger.log(this.peerOtherInfo, data.msg.otherInfo);

                            await this.peer.setRemoteDescription(data.desc);

                            stream.getTracks().forEach((track) => this.peer.addTrack(track, stream));

                            await this.peer.setLocalDescription(await this.peer.createAnswer());

                            if (this.metadata)
                                this.signaling.send({
                                    desc: this.peer.localDescription,
                                    msg: { ...this.metadata, otherInfo: { ...this.otherInfo, peerID: this.peerID } }
                                })
                            else this.signaling.send({ desc: this.peer.localDescription })

                        } catch (err) {
                            logger.error(err);
                        }
                    }
                },
                reject: this.stop,
                on: (type: string, listener: Listener) => this.on(type, listener)
            }

            this.emit("call", this.Call);
        })

        this.signaling.onCandidate.use((data: Signal) => {
            if (data.msg.data.s_id !== this.talkTo) return;
            this.peer.addIceCandidate(data.candidate);
        })

        this.signaling.onRejection.use((data: Signal) => {
            if (data.msg.data.s_id !== this.talkTo) return;
            logger.log('[RTC]: RECEIVED REJECTION');
            logger.log(data.msg);
            this.peer.close();
            this.emit('reject', this.peerID);
        })

        this.signaling.onMetadata = (data: Signal) => {
            logger.log('[Metadata]: Assign a handler', data.msg.data);
        }
    }

    set setmetadata(data: any) {
        this.metadata = data;
    }

    /**
     * Initiate the call
     * @param stream Provide mediastream which needs to be transmitted
     */
    call(stream: MediaStream) {
        this.polite = false;
        this.signaling.createRoom(generateUniqueID())
        stream.getTracks().forEach(track => this.peer.addTrack(track, stream));
    }

    /**
     * Stops the RTC session
     */
    stop() {
        if (!this.talkTo) throw new Error('No RTC session is going on');
        this.signaling.send({ msg: { type: 'reject', data: { to: this.talkTo } } })
        this.peer.close();
    }

}