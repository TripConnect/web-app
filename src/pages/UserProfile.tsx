import {useNavigate, useParams} from "react-router-dom";
import {gql, useMutation, useQuery} from '@apollo/client';
import {useSelector} from "react-redux";
import {Avatar, Button, Container, Grid, Typography} from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import {useTranslation} from "react-i18next";

const PRIVATE_CONVERSATION_MUTATION = gql`
    mutation CreateConversation($memberIds: [String!]!) {
        createConversation(type: PRIVATE, memberIds: $memberIds) {
            id
        }
    }
`;

const USER_QUERY = gql`
    query User($id: ID!) {
        user(id: $id) {
            id
            avatar
            displayName
        }
    }
`;

export default function UserProfile() {
  let navigate = useNavigate();
  const {t} = useTranslation();
  const {id: profileUserId} = useParams<{ id: string }>();
  const {loading: profileLoading, error: profileError, data: profileUser} = useQuery(USER_QUERY, {
    variables: {id: profileUserId},
  });
  const [createConversation] = useMutation(PRIVATE_CONVERSATION_MUTATION);
  const currentUser = useSelector((state: any) => state.user);

  if (profileLoading) return <center>Loading...</center>;
  if (profileError) return <center>Try again...</center>;

  let {displayName} = profileUser.user;

  const handleChat = () => {
    createConversation({variables: {memberIds: [currentUser.userId, profileUserId]}})
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
            <Avatar src={currentUser.avatar} style={{width: 100, height: 100, fontSize: '2.5rem'}}/>
            <Typography variant="h1" style={{
              marginLeft: 20,
              fontWeight: 500,
              fontSize: '2rem',
            }}>
              {displayName}
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
