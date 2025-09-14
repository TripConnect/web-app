import {Container, Grid} from '@mui/material';
import ActiveLivestreamList from "./livestream";

export default function Home() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <ActiveLivestreamList/>
        </Grid>
      </Grid>
    </Container>
  );
}
