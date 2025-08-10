import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from "socket.io-client";

import { RootState } from 'store';

export default function LivestreamHost() {
    const { id: roomId } = useParams<{ id: string }>();

    const [mediaConstraints, setMediaConstraints] = useState({ video: true, audio: false });
    const currentUser = useSelector((state: RootState) => state.user);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const [livesSocket, setLivesSocket] = useState<Socket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        console.log('Initiating Livestream resources');
        const livestreamSocket = io(`${process.env.REACT_APP_BASE_URL}/livestream`, {
            transports: ['websocket'],
            auth: {
                token: currentUser.accessToken
            }
        });
        livestreamSocket.on('connect', () => {
            setTimeout(async () => {
                // console.log('Livestream socket connected');
                if (!mediaStreamRef.current) {
                    console.log('Apply media stream');
                    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);
                }

                if (videoRef.current && !videoRef.current?.srcObject) {
                    console.log('Apply video source');
                    videoRef.current.srcObject = mediaStreamRef.current;
                    livestreamSocket?.emit(
                        "start",
                        { roomId },
                        (ack: { status: 'SUCCESS' | 'FAILED' }) => {
                            console.log("Start livestream: " + ack.status);
                        }
                    );
                }

                if (!recorderRef.current) {
                    console.log('Apply video recorder');
                    recorderRef.current = new MediaRecorder(mediaStreamRef.current);
                    recorderRef.current.addEventListener('dataavailable', event => {
                        console.log('Recorder data available');
                        if (event.data.size > 0) {
                            console.log('Send segment: ' + event.data.size);

                            livestreamSocket?.emit(
                                "segment",
                                {
                                    roomId,
                                    segment: event.data
                                },
                                (ack: { status: 'SUCCESS' | 'FAILED' }) => {
                                    console.log("Record: " + ack.status);
                                }
                            );
                        }
                    });
                    recorderRef.current.addEventListener('error', event => {
                        console.error("Livestream record error: " + event);
                    });
                    recorderRef.current.addEventListener('stop', event => {
                        console.warn('Video recorder stopped');
                    });
                    recorderRef.current.start(10_000);
                }
            }, 1000);
        });
        livestreamSocket.on('disconnect', (reason) => {
            console.log('Livestream socket disconnected: ' + reason);
        });
        livestreamSocket.on('connect_error', error => {
            console.error(error);
        });

        setLivesSocket(livestreamSocket);

        return () => {
            console.log('Clean up useEffect resources');
            livestreamSocket?.disconnect();
            recorderRef.current?.stop();
            mediaStreamRef.current?.getTracks().forEach(track => track.stop());

            recorderRef.current = null;
            mediaStreamRef.current = null;
        };
    }, []);

    console.log('Re-rendering');

    return (
        <section>
            <video
                key='livestream-video'
                ref={videoRef}
                style={{
                    display: 'block',
                    objectFit: 'contain',
                    margin: '0 auto',
                    width: '50vw',
                    height: '50vh',
                }}
                autoPlay
            >
                Your browser does not support the video tag.
            </video>
        </section>
    );
};
