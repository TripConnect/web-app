import {Avatar, Box, Card, CardContent, CardMedia, Chip, Typography} from "@mui/material";
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
              top: 242,
              right: 10,
              height: 28,
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
          <Box position='relative' width={46} height={46} sx={{'--badge-color': '#e1002d'}}>
            <Avatar
              src={currentUser.avatar}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: '4px solid var(--badge-color)',
                objectFit: 'cover',
              }}
            />
            <Chip
              size="small"
              icon={<SensorsIcon sx={{fontSize: '1rem', transform: 'translateX(25%) scale(1.2)'}}/>}
              color="error"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                borderRadius: '4px',
                transform: 'translate(10%, 10%) scale(0.55)',
                height: 'auto',
                padding: '2px',
              }}
            />
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