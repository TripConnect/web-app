import { useLocation, useNavigate, useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSelector } from "react-redux";
import { Avatar, Button, Container, Grid, Typography } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import { shortenFullName, stringToColor } from "helpers/avatar";
import { useTranslation } from "react-i18next";

const PRIVATE_CONVERSATION_MUTATION = gql`
    mutation CreateConversation($type: String!, $members: String!) {
        createConversation(type: $type, members: $members) {
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
    const { t, i18n } = useTranslation();
    const { id: profileUserId } = useParams<{ id: string }>();
    const { loading: profileLoading, error: profileError, data: profileUser } = useQuery(USER_QUERY, {
        variables: { id: profileUserId },
    });
    const [createConversation, { data, loading, error }] = useMutation(PRIVATE_CONVERSATION_MUTATION);
    const currentUser = useSelector((state: any) => state.user);

    if (profileLoading) return <center>Loading...</center>;
    if (profileError) return <center>Try again...</center>;

    let { displayName } = profileUser.user;

    const handleChat = () => {
        createConversation({ variables: { type: 'PRIVATE', members: [currentUser.userId, profileUserId].join(",") } })
            .then(response => {
                if (response?.data?.createConversation) {
                    let { id } = response.data.createConversation;
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
                        <Avatar
                            sx={{ bgcolor: stringToColor(profileUserId as string) }}
                            children={shortenFullName(displayName)}
                            style={{ width: 100, height: 100, fontSize: '2.5rem' }} />
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
                            style={{ textTransform: 'none' }}
                            variant="contained"
                            onClick={handleChat}
                        >
                            <ForumIcon />
                            <span style={{ display: 'inline-block', marginLeft: 5 }}>
                                {t('CHAT_BUTTON_BODY')}
                            </span>
                        </Button>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}
