import { useParams } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client';
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { CHAT_MESSAGE_EVENT } from "constants/socket";
import { ChatMessageModel } from 'types/chat';
import { CHAT_HISTORY_PAGE_SIZE } from "constants/common";
import { useTranslation } from "react-i18next";
import { RootState } from "store";
import { io, Socket } from "socket.io-client";

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
      connection.emit("unlisten", { conversationId: currentConversationId });
    }
  }, []);

  return (
    <Container>
      <Grid container >
        <Grid item xs={12}>
          <section>

          </section>
        </Grid>
        <Grid item xs={12}>
          <input type="text" />
        </Grid>
      </Grid>
    </Container>
  );
}