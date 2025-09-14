import React, {useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Card, CardMedia, Container} from '@mui/material';
import ReactHlsPlayer from 'react-hls-player';
import {graphql} from "../gql";
import {useQuery} from "@apollo/client";

const LIVESTREAM_DETAIL_QUERY = graphql(`
    query GetLivestreamDetail($id: ID!) {
        livestream(id: $id) {
            id
            hlsLink
        }
    }
`);

export default function LivestreamViewer() {
  const {id: livestreamId} = useParams<{ id: string }>();
  const playerRef = useRef<HTMLVideoElement>(null);

  const {data: livestreamDetail} = useQuery(LIVESTREAM_DETAIL_QUERY, {
    variables: {id: livestreamId as string},
  });

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Card sx={{mt: 2}}>
        <CardMedia>
          {
            livestreamDetail?.livestream.hlsLink ?
              <ReactHlsPlayer
                playerRef={playerRef}
                src={`${process.env.REACT_APP_BASE_URL}${livestreamDetail?.livestream.hlsLink}`}
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
              :
              <Box>Loading...</Box>
          }
        </CardMedia>
      </Card>
    </Container>
  );
};