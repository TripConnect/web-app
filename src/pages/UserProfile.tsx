import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from '@apollo/client';
import {useSelector} from "react-redux";
import {Avatar, Box, Button, Container, Grid, IconButton, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {RootState} from "../store";
import {graphql} from "../gql";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

const PRIVATE_CONVERSATION_MUTATION = graphql(`
    mutation CreateConversation($memberIds: [String!]!) {
        createConversation(type: PRIVATE, memberIds: $memberIds) {
            id
        }
    }
`);

const USER_QUERY = graphql(`
    query User($id: ID!) {
        user(id: $id) {
            id
            avatar
            displayName
        }
    }
`);

export default function UserProfile() {
  let navigate = useNavigate();
  const {t} = useTranslation();
  const {id: profileUserId} = useParams<{ id: string }>();

  const {loading: profileLoading, error: profileError, data: userProfile} = useQuery(USER_QUERY, {
    variables: {id: profileUserId as string},
  });
  const [createConversation] = useMutation(PRIVATE_CONVERSATION_MUTATION);
  const currentUser = useSelector((state: RootState) => state.user);
  const isSelf = profileUserId !== currentUser.userId;

  if (profileLoading) return <center>Loading...</center>;
  if (profileError) return <center>Try again...</center>;

  const handleChat = () => {
    createConversation({variables: {memberIds: [currentUser.userId as string, profileUserId as string]}})
      .then(response => {
        if (response?.data?.createConversation) {
          let {id} = response.data.createConversation;
          navigate("/conversation/" + id);
        }
      }).catch(e => {
      console.log(e);
    })
  }

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="start"
            alignItems="center"
            marginTop={6}
            marginBottom={20}
          >
            <Avatar src={currentUser.avatar} style={{width: 170, height: 170, fontSize: '2.5rem'}}/>
            <Box marginLeft={6}>
              <Typography variant="subtitle1" fontSize={'2rem'} fontWeight={'bold'} marginBottom={2}>
                {userProfile?.user.displayName}
              </Typography>
              {
                isSelf && (
                  <>
                    <Button
                      style={{textTransform: 'none', marginRight: 12}}
                      size={'medium'}
                      variant="contained"
                    >
                      <PersonAddAltIcon/>
                      <span style={{display: 'inline-block', marginLeft: 8}}>
                        {t('USER_PROFILE.FOLLOW_BUTTON')}
                      </span>
                    </Button>
                    <Button
                      style={{textTransform: 'none', marginRight: 14}}
                      size={'medium'}
                      variant="outlined"
                      onClick={handleChat}
                    >
                      <SmsOutlinedIcon/>
                      <span style={{display: 'inline-block', marginLeft: 8}}>
                        {t('USER_PROFILE.MESSAGE_BUTTON')}
                      </span>
                    </Button>
                  </>
                )
              }
              <IconButton title={`${document.location.origin}/profile/${userProfile?.user.id}`}
                          sx={{border: 'solid 0.6px #ccd'}}
                          size={'small'}
                          onClick={() => {
                            navigator.clipboard.writeText(`${document.location.origin}/profile/${userProfile?.user.id}`);
                          }}>
                <ShareOutlinedIcon fontSize={'small'} sx={{fontSize: 20}}/>
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
