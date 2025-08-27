import React, {useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, Card, Typography} from '@mui/material';
import axios from 'axios';

const LivestreamHost: React.FC = () => {
  const [livestreamId, setLivestreamId] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch stream key after login (assume JWT in localStorage)
    axios.post(`${process.env.REACT_APP_BASE_URL}/livestreams`)
      .then((res: any) => setLivestreamId(res.data.livestreamId))
      .catch(() => setError('Failed create livestream'));
  }, []);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Camera access denied');
    }
  };

  const startStream = () => {
    // For OBS: User manually starts in OBS.
    // For browser: Implement MediaRecorder here (example below, but needs backend WebSocket for chunk upload)
    setIsLive(true);
    // Placeholder: Poll backend for status every 10s
    const interval = setInterval(() => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/livestreams/${livestreamId}/status`)
        .then(res => setIsLive(res.data.isLive));
    }, 10000);
    return () => clearInterval(interval);
  };

  const startBrowserStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    recorder.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        const formData = new FormData();
        formData.append('segment', e.data);
        formData.append('livestreamId', livestreamId);
        await axios.post(`${process.env.REACT_APP_BASE_URL}/livestreams/segment`, formData);
      }
    };
    recorder.start(1000); // Chunk every 1s
  };

  return (
    <Box sx={{p: 4}}>
      <Typography variant="h4">Host Dashboard</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Card sx={{mt: 2, p: 2}}>
        <Typography>Your Stream Key: {livestreamId}</Typography>
        <Typography>RTMP URL: rtmp://localhost/live/{livestreamId}</Typography>
        <Button variant="contained" onClick={startPreview} sx={{mt: 2}}>Preview Camera</Button>
        <video ref={videoRef} autoPlay muted width="100%"/>
        <Button variant="contained" color="primary" onClick={startStream} disabled={isLive}>Go Live (OBS)</Button>
        <Button variant="outlined" onClick={startBrowserStream}>Go Live (Browser - Experimental)</Button>
        {isLive && <Alert severity="success">You are live!</Alert>}
      </Card>
    </Box>
  );
};

export default LivestreamHost;
