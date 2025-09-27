import {Box, Button, Container, Grid, Typography} from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {LivestreamState} from "./state";
import {useLazyQuery, useMutation} from "@apollo/client";
import {graphql} from "../../gql";
import LivePreview from "./components/LivePreview";

const ACTIVE_LIVESTREAMS_QUERY = graphql(`
    query GetActiveLives($pageNumber: Int!, $pageSize: Int!, $status: String) {
        livestreams(pageNumber: $pageNumber, pageSize: $pageSize, status: $status) {
            id
            hlsLink
        }
    }
`);

const CREATE_LIVES_MUTATION = graphql(`
    mutation CreateLives {
        createLivestream {
            id
            hlsLink
        }
    }
`);

export default function ActiveLivestreamList() {
  const navigate = useNavigate();

  const [getActiveLives] = useLazyQuery(ACTIVE_LIVESTREAMS_QUERY);
  const [createLives] = useMutation(CREATE_LIVES_MUTATION);
  const [activeLivestreams, setActiveLivestreams] = useState<LivestreamState[]>([]);

  useEffect(() => {
    getActiveLives({
      variables: {
        status: 'CREATED',
        pageNumber: 0,
        pageSize: 10,
      }
    })
      .then(resp => resp.data?.livestreams.map((lives): LivestreamState => ({
        id: lives.id,
        hlsLink: lives.hlsLink,
      })))
      .then(lives => lives && setActiveLivestreams(lives));
  }, []);

  const handleGoLives = async () => {
    let resp = await createLives();
    let livestreamId = resp.data?.createLivestream.id;
    navigate(`/livestream/${livestreamId}/host`);
  }

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} marginTop={4}>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems={"center"}>
            <Typography variant="h1" fontSize={'2rem'} fontWeight={'bold'} marginBottom={2}>
              Active livestreams
            </Typography>
            <Button color={'primary'} variant={"contained"} size={'medium'} onClick={handleGoLives}>
              <VideocamIcon sx={{marginRight: 0.6}} fontSize={'small'}/>
              Go lives
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} marginTop={2}>
          {/*<Box display='flex' justifyContent='start' alignItems='center' gap={2}>*/}
          {/*  {activeLivestreams.length ?*/}
          {/*    activeLivestreams.map(livestream => (*/}
          {/*      <LivePreview*/}
          {/*        key={livestream.id}*/}
          {/*        title={"Sample title"}*/}
          {/*        livestreamId={livestream.id}*/}
          {/*        thumbnail={'https://img.freepik.com/free-vector/travel-youtube-thumbnail_23-2148561450.jpg'}*/}
          {/*      />*/}
          {/*    )) :*/}
          {/*    <div>No any active lives</div>}*/}
          {/*</Box>*/}
          <Box display='flex' justifyContent='start' alignItems='center' gap={2}>
            <LivePreview
              key={"livestream.id"}
              title={"The wild wolf | Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock"}
              livestreamId={"livestream.id"}
              thumbnail={'https://img.freepik.com/free-vector/travel-youtube-thumbnail_23-2148561450.jpg'}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}