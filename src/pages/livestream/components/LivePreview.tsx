import {Avatar, Box, Card, CardContent, CardMedia, Chip, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SensorsIcon from '@mui/icons-material/Sensors';


type Props = {
  livestreamId: string;
  title: string;
  thumbnail: string
};

export default function LivePreview(props: Props) {
  const {livestreamId, title, thumbnail} = props;

  const currentUser = useSelector((state: RootState) => state.user);

  return (
    <Card sx={{width: 480}}
          component={Link}
          to={`/livestream/${livestreamId}/view`}
          style={{textDecoration: 'none', position: 'relative'}}>

      <Chip icon={<SensorsIcon fontSize='small'/>} label="Live" color='error'
            style={{position: "absolute", top: 238, right: 10, borderRadius: 4}}/>
      <Chip icon={<VisibilityIcon fontSize='small'/>} label="123" color='info'
            style={{position: "absolute", top: 10, right: 10, borderRadius: 4}}/>

      <CardMedia
        component="img"
        alt="livestream thumbnail"
        height="280"
        image={thumbnail}
      />
      <CardContent>
        <Box marginBottom={0.8}>
          <Typography variant={"h5"} sx={{textDecoration: 'none'}}>
            {title}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center" height={30}>
          <Avatar src={currentUser.avatar} style={{width: 32, height: 32}}/>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{color: 'grey', marginLeft: 1.2}}
          >
            Display name
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}