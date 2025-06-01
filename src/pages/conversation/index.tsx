import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarGroup, Box, Container, Grid, IconButton, Skeleton, TextField, Typography, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ChatMessageModel } from 'types/chat';
import { RootState } from "store";
import { io, Socket } from "socket.io-client";

export default function Conversation() {
  const { id: currentConversationId } = useParams<{ id: string }>();
  const currentUser = useSelector((state: RootState) => state.user);
  const theme = useTheme();

  const [conversationInfo, setConversationInfo] = useState<{ name: string, type: "PRIVATE" | "GROUP" }>(); // for title display
  const [topMembers, setTopMember] = useState<{ name: string, avatar: string }[]>([]); // for avatar display

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
      connection.emit("listen", { conversationId: currentConversationId });
    });
    connection.io.on('reconnect', () => {
      console.log('reconnected');
      connection.emit('listen', { conversationId: currentConversationId });
    });
    connection.on('connect_error', err => {
      console.log(err.message);
    });
    connection.on('message', (payload: ChatMessageModel) => {
      console.log("receive mesasge");
    });

    return () => {
      console.log("<Conversation /> unmounted");
      connection.emit("unlisten", { conversationId: currentConversationId });
    }
  }, []);

  return (
    <Container sx={{ height: theme.contentAvailableHeight }}>
      {/* Header start */}
      <Grid container xs={12} md={8} justifyContent="center" alignItems="center" margin="0 auto" sx={{ height: "10%" }}>
        <Grid item xs={12}>
          <Box component="section" sx={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>
            {
              topMembers.length ?
                <AvatarGroup max={4}>{topMembers.map(member => <Avatar src={member.avatar} />)}</AvatarGroup> :
                <Skeleton variant="circular" animation="wave"><Avatar sx={{ ...theme.avatar.md }} /></Skeleton>
            }
            {
              conversationInfo?.name ?
                <Typography variant="h6" noWrap component="span">{conversationInfo?.name}</Typography> :
                <Skeleton variant="text" width="40%" height="28px" animation="wave" />
            }
          </Box>
        </Grid>
      </Grid>
      {/* Header end */}

      {/* Conversation start */}
      <Grid container xs={12} md={8} justifyContent="center" alignItems="center" margin="0 auto" sx={{ height: "80%" }}>
        <Grid item xs={12} >
          <Box component="section" className="conversation-section">

          </Box>
        </Grid>
      </Grid>
      {/* Conversation end */}

      {/* Chat input start */}
      <Grid container xs={12} md={8} justifyContent="center" alignItems="center" margin="0 auto" sx={{
        height: "10%",
        width: "100%",
      }}>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Box>
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