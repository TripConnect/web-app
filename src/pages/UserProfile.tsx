import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from '@apollo/client';
import {useSelector} from "react-redux";
import {Avatar, Button, Container, Grid, Typography} from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import {useTranslation} from "react-i18next";
import {RootState} from "../store";
import {graphql} from "../gql";

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
          <section style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 20
          }}>
            <Avatar src={currentUser.avatar} style={{width: 120, height: 120, fontSize: '2.5rem'}}/>
            <Typography variant="subtitle1" fontSize={'2rem'} fontWeight={'bold'} marginLeft={6}>
              {userProfile?.user.displayName}
            </Typography>
          </section>

          {
            profileUserId !== currentUser.userId && <Button
                  style={{textTransform: 'none'}}
                  variant="contained"
                  onClick={handleChat}
              >
                  <ForumIcon/>
                  <span style={{display: 'inline-block', marginLeft: 5}}>
                    {t('CHAT_BUTTON_BODY')}
                  </span>
              </Button>
          }
        </Grid>
      </Grid>
    </Container>
  );
}
