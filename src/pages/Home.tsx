import {Container, Grid} from '@mui/material';
import {Link} from "react-router-dom";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function Home() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Link
            to={`/livestream/${crypto.randomUUID()}/host`}
            style={{
              textDecoration: 'none',
              color: 'black',
              display: 'flex',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
                border: 'solid 1px black',
                borderRadius: 4,
                padding: '4px 10px',
                width: '5vw',
              }}
            >
              <FiberManualRecordIcon color='error'/>
              Lives
            </div>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
