import {Avatar, Badge, Box, Card, CardContent, CardMedia, Chip, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import SensorsIcon from '@mui/icons-material/Sensors';
import {useTranslation} from "react-i18next";

type Props = {
  livestreamId: string;
  title: string;
  thumbnail: string
};

export default function LivePreview(props: Props) {
  const {t} = useTranslation();
  const {livestreamId, title, thumbnail} = props;

  const currentUser = useSelector((state: RootState) => state.user);

  return (
    <Card sx={{minWidth: 480, boxShadow: 'none', width: '45%'}}
          component={Link}
          to={`/livestream/${livestreamId}/view`}
          style={{textDecoration: 'none', position: 'relative'}}>

      <Chip icon={<SensorsIcon fontSize='small'/>} label={t('LIVESTREAM.LIVE')} color='error'
            style={{
              position: "absolute",
              top: 238,
              right: 10,
              borderRadius: 4,
              textTransform: 'uppercase',
              transform: 'scale(0.95)',
            }}/>

      <CardMedia
        component="img"
        alt="livestream thumbnail"
        height="280"
        image={thumbnail}
      />
      <CardContent style={{padding: 10, paddingLeft: 0}}>
        <Box display='flex' justifyContent='start' alignItems='start' gap={1.2}>
          <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <Badge
              badgeContent={
                <Chip
                  size="small"
                  icon={<SensorsIcon sx={{fontSize: '1rem', transform: 'translateX(25%) scale(1.2)'}}/>}
                  color="error"
                  sx={{
                    borderRadius: '4px',
                    transform: 'translate(60%, -40%) scale(0.55)',
                    height: 'auto',
                    padding: '2px',
                  }}
                />
              }
              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
              sx={{'--badge-color': '#e1002d'}}
            >
              <Avatar
                src={currentUser.avatar}
                sx={{
                  objectFit: 'cover',
                  width: 46,
                  height: 46,
                  border: '4px solid var(--badge-color)',
                }}
              />
            </Badge>
          </Box>
          <Box display='flex' flexDirection={'column'} justifyContent='center' alignItems='start'>
            <Typography variant={"h6"} title={title} maxWidth={400} whiteSpace={'nowrap'} overflow={'hidden'}
                        textOverflow={'ellipsis'}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{color: 'grey'}}
            >
              Display name
            </Typography>
            <Typography variant={"body2"} sx={{color: 'grey'}}>
              123 <span>{t('LIVESTREAM.VIEWER')}</span>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}