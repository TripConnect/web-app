import { useParams } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ChatMessageModel } from 'types/chat';
import { RootState } from "store";
import { io, Socket } from "socket.io-client";
import "./index.scss";

export default function Conversation() {
  const { id: currentConversationId } = useParams<{ id: string }>();
  const currentUser = useSelector((state: RootState) => state.user);

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
    <Container>
      <Grid container xs={12} md={8} justifyContent="center" alignItems="center" margin="0 auto">
        <Grid item xs={12}>
          <section className="conversation-section">

          </section>
        </Grid>
        <Grid item xs={12}>
          <section className="input-section">
            <TextField
              className="input-section__inpMessage"
              multiline
              size="small"
              rows={1}
              placeholder="Chat message..."
              variant="outlined"
            />
            <SendIcon className="input-section__btnSendMessage" />
          </section>
        </Grid>
      </Grid>
    </Container>
  );
}