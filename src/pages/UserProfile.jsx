import { useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useSelector } from "react-redux";
import { Button, Container, Grid, Typography } from "@mui/material";

const PRIVATE_CONVERSATION_MUTATION = gql`
    mutation CreateConversation($type: String!, $members: String!) {
        createConversation(type: $type, members: $members) {
            id
        }
    }
`;

export default function UserProfile(props) {
    const location = useLocation();
    let navigate = useNavigate();
    let { userId: profileUserId, displayName } = location.state;
    const [createConversation, { data, loading, error }] = useMutation(PRIVATE_CONVERSATION_MUTATION);
    const currentUser = useSelector((state) => state.user);
    const isUserLoggedIn = Boolean(currentUser.userId);

    const handleChat = (e) => {
        createConversation({ variables: { type: 'PRIVATE', members: [currentUser.userId, profileUserId].join(",") } })
            .then(response => {
                if (response?.data?.createConversation) {
                    let { id: conversationId } = response.data.createConversation;
                    navigate("/conversation", { state: { conversationId } });
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
                        isUserLoggedIn && profileUserId !== currentUser.userId && <Button
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
