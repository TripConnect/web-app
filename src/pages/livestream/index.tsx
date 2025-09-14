import {Box, Button, Container, Grid, Typography} from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {LivestreamState} from "./state";
import {useLazyQuery, useMutation} from "@apollo/client";
import {graphql} from "../../gql";

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
        <Grid item xs={12}>
          <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', textDecoration: 'none'}}>
            <Button color={'primary'} variant={"contained"} size={'large'} onClick={handleGoLives}>
              <VideocamIcon sx={{marginRight: 0.6}}/>
              Go lives
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h1" fontSize={'2rem'} fontWeight={'bold'} marginBottom={2}>
            Active livestreams
          </Typography>
          <Box>
            {activeLivestreams.length ?
              activeLivestreams.map(livestream => (
                <Button key={livestream.id} variant='contained'
                        href={`/livestream/${livestream.id}/view`}>
                  View {livestream.id}
                </Button>)) :
              <div>No any active lives</div>}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}