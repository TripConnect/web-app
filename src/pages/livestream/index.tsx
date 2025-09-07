import {Box, Button, Container, Grid, Typography} from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import {useNavigate} from "react-router-dom";

export default function ActiveLivestreamList() {
  const navigate = useNavigate();

  const handleGoLives = () => {
    let livestreamId = crypto.randomUUID();
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
        </Grid>
      </Grid>
    </Container>
  );
}