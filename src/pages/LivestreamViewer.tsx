import React, {useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Card, CardMedia, Container} from '@mui/material';
import ReactHlsPlayer from 'react-hls-player';


export default function LivestreamViewer() {
  const {id: livestreamId} = useParams<{ id: string }>();
  const playerRef = useRef<HTMLVideoElement>(null);


  const streamUrl = `${process.env.REACT_APP_BASE_URL}/livestream/${livestreamId}/index.m3u8`;

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Card sx={{mt: 2}}>
        <CardMedia>
          <ReactHlsPlayer
            playerRef={playerRef}
            src={streamUrl}
            autoPlay={true}
            controls={true}
            width="100%"
            height="auto"
            hlsConfig={{
              lowLatencyMode: true, // Optimize for live-streaming
              backBufferLength: 30, // Keep 30s of back buffer
            }}
            onError={e => {
              console.log('Failed to load stream. It may be offline or unavailable.');
            }}
          />
        </CardMedia>
      </Card>
    </Container>
  );
};