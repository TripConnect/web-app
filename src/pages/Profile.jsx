import { useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useSelector } from "react-redux";

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
    const currentUserId = useSelector((state) => state.user.userId);

    const handleChat = (e) => {
        createConversation({ variables: { type: 'PRIVATE', members: [userId, currentUserId].join(",") } })
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
        <div>
            <div>{displayName}</div>
            <button type="button" onClick={handleChat}>Chat</button>
        </div>
    );
}
