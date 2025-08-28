import React, {useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, Typography} from '@mui/material';
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

  const startBrowserStream = async () => {
    setIsLive(true);
    await startPreview();
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
    <Box width={'100vw'} height={'auto'}>
      <Typography variant="h4">Host Dashboard</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography>
        <b>Share link:</b>
        {`${document.location.origin}/livestream/${livestreamId}/view`}
      </Typography>
      <Box>
        <video ref={videoRef} autoPlay muted height="500px" style={{background: 'red'}}/>
      </Box>
      <Box>
        {isLive ?
          <Alert severity="success">You are live!</Alert> :
          <Button variant="outlined" onClick={startBrowserStream}>Go Live</Button>}
      </Box>
    </Box>
  );
};

export default LivestreamHost;
