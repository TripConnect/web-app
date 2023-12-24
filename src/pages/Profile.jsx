import { useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';

const PRIVATE_CONVERSATION_MUTATION = gql`
  mutation CreateConversation($type: String!, $members: String!) {
    createConversation(type: $type, members: $members) {
        id
    }
  }
`;

export default function Profile(props) {
    const location = useLocation();
    let navigate = useNavigate();
    const [createConversation, { data, loading, error }] = useMutation(PRIVATE_CONVERSATION_MUTATION);
    let { id: userId, displayName } = location.state;
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const handleChat = (e) => {
        createConversation({ variables: { type: 'PRIVATE', members: [userId, currentUser.id].join(",") } })
            .then(response => {
                if (response?.data?.createConversation) {
                    console.log(response?.data?.createConversation, "chat");
                    let { id: conversationId } = response.data.createConversation;
                    // navigate("/chat", { state: { conversationId } });
                }
            }).catch(e => {
                console.log(e);
            })
    }

    return (
        <div>
            <div>{displayName}</div>
            <button type="button" onClick={handleChat}>Chat</button>
        </div>
    );
}
