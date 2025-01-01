import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from "socket.io-client";

export default function LivestreamHost() {
    const { id: roomId } = useParams<{ id: string }>();
    const mediaConstraints: MediaStreamConstraints = { video: true, audio: true };

    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [chatSocket, setChatSocket] = useState<Socket | null>(null);
    const currentUser = useSelector((state: any) => state.user);

    if (!roomId) {
        navigate('/');
    }

    useEffect(() => {
        let connection: Socket = io(
            `${process.env.REACT_APP_BASE_URL}/livestream`,
            {
                transports: ['websocket'], // you need to explicitly tell it to use websockets
                auth: {
                    token: currentUser.accessToken,
                }
            },
        )
            .on('connect', async () => {
                console.log('Socket io connected');
                // connection.emit('start', { roomId });

                // streamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);

                // if (videoRef.current) {
                //     videoRef.current.srcObject = streamRef.current;
                // }

                // mediaRecorderRef.current = new MediaRecorder(streamRef.current);

                // mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                //     if (event.data.size > 0) {
                //         connection.emit('segment', { roomId, segment: event.data })
                //     }
                // };

                // mediaRecorderRef.current.start(10_000); // 10-second chunks
            })
            .on('connect_error', err => {
                console.error(err.message);
            });

        setChatSocket(connection);
    }, []);

    // Handle messages from parent window
    const handleMessages = (event: MessageEvent) => {
        const { name, payload } = event.data;

        switch (name) {
            case 'disableCamera':
                disableCamera();
                break;
            case 'enableCamera':
                enableCamera();
                break;
            case 'muteMic':
                muteMic();
                break;
            case 'unmuteMic':
                unmuteMic();
                break;
            case 'end':
                endLive();
                break;
            case 'switchCamera':
                if (payload?.deviceLabel) {
                    switchCamera(payload.deviceLabel);
                }
                break;
            default:
                console.warn('Unknown message received:', name);
        }
    };

    // Helper functions with proper typing
    const disableCamera = () => {
        streamRef.current?.getVideoTracks().forEach((track) => (track.enabled = false));
    };

    const enableCamera = () => {
        streamRef.current?.getVideoTracks().forEach((track) => (track.enabled = true));
    };

    const muteMic = () => {
        streamRef.current?.getAudioTracks().forEach((track) => (track.enabled = false));
    };

    const unmuteMic = () => {
        streamRef.current?.getAudioTracks().forEach((track) => (track.enabled = true));
    };

    const switchCamera = async (deviceLabel: string) => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevice = devices.find((device) => device.label === deviceLabel);

        if (videoDevice) {
            const newStream = await navigator.mediaDevices.getUserMedia({
                ...mediaConstraints,
                video: { deviceId: videoDevice.deviceId },
            });

            const oldVideoTrack = streamRef.current?.getVideoTracks()[0];
            const newVideoTrack = newStream.getVideoTracks()[0];

            if (streamRef.current) {
                streamRef.current.removeTrack(oldVideoTrack!);
                streamRef.current.addTrack(newVideoTrack);
            }

            newStream.getTracks().forEach((track) => {
                if (newVideoTrack.id !== track.id) track.stop();
            });

            oldVideoTrack?.stop();
        }
    };

    const endLive = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current?.stop();
    };

    // Initialize streaming and setup message listener
    useEffect(() => {
        window.addEventListener('message', handleMessages);
        return () => {
            window.removeEventListener('message', handleMessages);
            endLive(); // Cleanup on unmount
        };
    }, []);

    return (
        <div>
            <video
                key="livestream-local-video"
                id="livestream-local-video"
                ref={videoRef}
                autoPlay
                muted
                style={{ width: '100%', border: '1px solid #ccc' }}
            />
        </div>
    );
};
