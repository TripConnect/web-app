import {Avatar, Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

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
          style={{textDecoration: 'none'}}>
      <CardMedia
        component="img"
        alt="livestream thumbnail"
        height="280"
        image={thumbnail}
      />
      <CardContent>
        <Box marginBottom={0.8}>
          <Typography variant={"h5"}>
            Let livestream with me
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center">
          <Avatar src={currentUser.avatar} style={{width: 38, height: 38}}/>
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