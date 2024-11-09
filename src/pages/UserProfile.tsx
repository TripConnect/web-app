import { useLocation, useNavigate, useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSelector } from "react-redux";
import { Button, Container, Grid, Typography } from "@mui/material";

const PRIVATE_CONVERSATION_MUTATION = gql`
    mutation CreateConversation($type: String!, $members: String!) {
        createConversation(type: $type, members: $members) {
            id
        }
    }
`;

const USER_QUERY = gql`
    query User($id: String!) {
        user(id: $id) {
            id
            avatar
            username
            displayName
        }
    }
`;

export default function UserProfile() {
    let navigate = useNavigate();
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
                    <Typography variant="h1" style={{
                        fontWeight: 500,
                        fontSize: '2rem',
                    }}>
                        {displayName}
                    </Typography>
                    {
                        profileUserId !== currentUser.userId && <Button
                            variant="contained"
                            onClick={handleChat}
                        >
                            Chat
                        </Button>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}
