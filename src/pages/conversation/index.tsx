import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarGroup, Box, Container, Grid, IconButton, Skeleton, TextField, Typography, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ChatMessageModel } from 'types/socket.type';
import { RootState } from "store";
import { io, Socket } from "socket.io-client";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { GraphQLModels } from "types/graphql.type";
import ChatMessage from "./ChatMesasge";

const MESSAGE_PAGE_NUMBER = 50;

const FIND_CONVERSATION_QUERY = gql`
  query Conversation($id: ID!) {
    conversation(id: $id) {
      type
      name
      members {
        id
        avatar
        displayName
      }
    }
  }
`;

const CHAT_HISTORY_QUERY = gql`
  query Conversation($id: ID!, $messagePageNumber: Int!, $messagePageSize: Int!) {
    conversation(id: $id) {
      messages(messagePageNumber: $messagePageNumber,messagePageSize: $messagePageSize) {
        id
        content
        fromUser {
          avatar
          displayName
          id
        }
        createdAt
      }
    }
  }
`;

export default function Conversation() {
  const { id: currConvId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const currentUser = useSelector((state: RootState) => state.user);

  if (!currConvId) {
    navigate("/");
  }

  // Conversation members
  const { loading: convLoading, error: convError, data: convData } = useQuery<
    { conversation?: GraphQLModels.Conversation }, GraphQLModels.ConversationQueryInput
  >(
    FIND_CONVERSATION_QUERY,
    { variables: { id: currConvId as string } }
  );
  // Conversation chatting history
  const [fetchChatHistory, { loading: historyLoading, error: historyError, data: historyData }] = useLazyQuery<
    { conversation?: GraphQLModels.Conversation },
    GraphQLModels.ConversationQueryInput | GraphQLModels.MessagesQueryArgs
  >(CHAT_HISTORY_QUERY);

  // socket initialization
  useEffect(() => {
    let connection: Socket = io(
      `${process.env.REACT_APP_BASE_URL}/chat`,
      {
        transports: ['websocket'], // you need to explicitly tell it to use websockets
        auth: {
          token: currentUser.accessToken,
        }
      },
    );
    connection.on('connect', () => {
      console.log('connected');
      connection.emit("listen", { conversationId: currConvId });
    });
    connection.io.on('reconnect', () => {
      console.log('reconnected');
      connection.emit('listen', { conversationId: currConvId });
    });
    connection.on('connect_error', err => {
      console.log(err.message);
    });
    connection.on('message', (payload: ChatMessageModel) => {
      console.log("receive mesasge");
    });

    return () => {
      console.log("<Conversation /> unmounted");
      connection.emit("unlisten", { conversationId: currConvId });
    }
  }, []);

  // chat history initiazation
  useEffect(() => {
    fetchChatHistory({
      variables: {
        id: currConvId as string,
        messagePageNumber: 0,
        messagePageSize: MESSAGE_PAGE_NUMBER
      }
    });
  }, []);

  return (
    <Container component="main" sx={{ height: theme.contentAvailableHeight }}>
      {/* Header start */}
      <Grid container justifyContent="center" alignItems="center" margin="0 auto" sx={{ height: "10%" }}>
        <Grid item xs={12} md={8}>
          <Box component="section" sx={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>
            {
              convData ?
                <AvatarGroup spacing="small" max={4}>
                  {
                    convData.conversation!.members!
                      .filter(member => member.id !== currentUser.userId)
                      .map(member => <Avatar key={`conv-avt-${member.id}`} src={member.avatar} />)
                  }
                </AvatarGroup> :
                <Skeleton variant="circular" animation="wave"><Avatar key="conv-default-avt" sx={{ ...theme.avatar.md }} /></Skeleton>
            }
            {
              convData ?
                <Typography variant="h6" noWrap component="span" fontSize="1.4rem" fontWeight="540">
                  {
                    convData.conversation?.type === GraphQLModels.ConversationType.PRIVATE ?
                      convData.conversation?.members?.find(m => m.id !== currentUser.userId)?.displayName :
                      convData.conversation?.name
                  }
                </Typography> :
                <Skeleton variant="text" width="40%" height="28px" animation="wave" />
            }
          </Box>
        </Grid>
      </Grid>
      {/* Header end */}

      {/* Conversation start */}
      <Grid container justifyContent="center" alignItems="center" margin="0 auto" sx={{ height: "80%", overflow: "auto" }}>
        <Grid item xs={12} md={8}>
          <Box component="section" className="conversation-section">
            {historyData?.conversation?.messages?.map(message => <ChatMessage key={message.id} {...message} />)}
          </Box>
        </Grid>
      </Grid>
      {/* Conversation end */}

      {/* Chat input start */}
      <Grid container justifyContent="center" alignItems="center" margin="0 auto" sx={{
        height: "10%",
        width: "100%",
      }}>
        <Grid item xs={12} md={8}>
          <Box component="section">
            <TextField
              className="input-section__inpMessage"
              multiline
              size="small"
              rows={1}
              placeholder="Chat message..."
              variant="outlined"
              sx={{ width: "90%" }}
            />
            <SendIcon className="input-section__btnSendMessage" fontSize="large" sx={{ width: "10%", cursor: "pointer" }} />
          </Box>
        </Grid>
      </Grid>
      {/* Chat input end */}
    </Container >
  );
}