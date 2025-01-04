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
    const livesConnRef = useRef<Socket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        console.log('Initiating Livestream resources');
        livesConnRef.current = io(`${process.env.REACT_APP_BASE_URL}/livestream`, {
            transports: ['websocket'],
            auth: {
                token: currentUser.accessToken
            }
        })
            .on('connect', async () => {
                console.log('livestream socket connected');
                if (!videoRef.current) return;
                if (videoRef.current?.srcObject) return;

                mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);
                videoRef.current.srcObject = mediaStreamRef.current;
                livesConnRef.current?.emit('start', { roomId });

                recorderRef.current = new MediaRecorder(mediaStreamRef.current);
                recorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        livesConnRef.current?.emit('segment', {
                            roomId,
                            segment: event.data
                        });
                    }
                };
                recorderRef.current.start(10_000);
            })
            .on('error', async (error) => {
                console.error(error);
            });

        return () => {
            livesConnRef.current?.disconnect();
        };
    }, []);

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
