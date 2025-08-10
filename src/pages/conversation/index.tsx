import {useCallback, useEffect, useState} from "react";
import MessageList from "./components/MessageList";
import {Message, ScrollDirection} from "./state";
import {graphql} from "../../gql";
import {useParams} from "react-router-dom";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import MessageComposer from "./components/MessageComposer";
import {useTranslation} from "react-i18next";
import {Container, Grid} from "@mui/material";
import {io, Socket} from "socket.io-client";
import {RootState} from "../../store";
import {useSelector} from "react-redux";

const FETCH_LIMIT = 50;

const INIT_UI_QUERY = graphql(`
    query InitUiQuery($id: ID!) {
        conversation(id: $id) {
            name
            type
        }
    }
`);

const FETCH_MESSAGE_QUERY = graphql(`
  query FetchMessageQuery($id: ID!, $before: DateTime, $after: DateTime, $limit: Int!) {
      conversation(id: $id) {
          messages(messageBefore: $before, messageAfter: $after, messageLimit: $limit) {
              id
              content
              createdAt
              sentTime
              fromUser {
                  id
                  displayName
                  avatar
              }
          }
      }
    }
`);

const SEND_MESSAGE_MUTATION = graphql(`
    mutation SendMessageMutation($conversationId: ID!, $content: String!) {
        sendMessage(conversation_id: $conversationId, content: $content) {
            correlationId
        }
    }
`);

export function Conversation() {
  const {id: conversationId = ""} = useParams<{ id: string }>();

  // common hooks
  const {t} = useTranslation();
  const currentUser = useSelector((state: RootState) => state.user);
  const [fetchMoreType, setFetchMoreType] = useState<"before" | "after">("before");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket>();

  // debounce hooks
  const changeScrollDirection = useCallback((direction: ScrollDirection) => {
    if (fetchMoreType === "before" && direction === "up") return;
    if (fetchMoreType === "after" && direction === "down") return;

    setFetchMoreType(direction === "up" ? "before" : "after");
  }, [fetchMoreType]);

  // graphql hooks
  const {data: convInfo} = useQuery(INIT_UI_QUERY, {
    variables: {
      id: conversationId,
    }
  });

  const [fetchMessage, {loading: fetchMessageLoading}] = useLazyQuery(FETCH_MESSAGE_QUERY);
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const callFetchMore = useCallback(async (conversationId: string, limit: number, before?: Date, after?: Date): Promise<Message[]> => {
    let response = await fetchMessage({
      variables: {
        id: conversationId,
        before: before,
        after: after,
        limit: limit
      }
    });

    let msgList = response.data?.conversation.messages;
    if (!msgList || msgList.length === 0) return [];

    return msgList.map(msg => ({
      id: msg.id,
      fromUser: msg.fromUser,
      content: msg.content,
      sentTime: msg.sentTime,
    })).reverse();
  }, [fetchMessage]);

  // action definitions
  const fetchMore = useCallback(async (): Promise<void> => {
    if (fetchMessageLoading) return;

    let before: Date | undefined;
    let after: Date | undefined;

    if (fetchMoreType === "before") {
      before = messages.length ?
        new Date(Math.min(...messages
          // eslint-disable-next-line eqeqeq
          .filter(msg => msg.sentTime)
          .map(msg => +new Date(msg.sentTime as string)))) : undefined;
    } else {
      after = messages.length ?
        new Date(Math.max(...messages
          // eslint-disable-next-line eqeqeq
          .filter(msg => msg.sentTime)
          .map(msg => +new Date(msg.sentTime as string)))) : undefined;
    }

    let gqlMessages = await callFetchMore(conversationId, FETCH_LIMIT, before, after);

    if (fetchMoreType === "before") {
      setMessages(prev => [...gqlMessages.reverse(), ...prev]);
    } else {
      setMessages(prev => [...prev, ...gqlMessages.reverse()]);
    }

    setHasMore(gqlMessages.length > FETCH_LIMIT);
  }, [fetchMessageLoading, fetchMoreType, callFetchMore, conversationId, messages]);

  // effect hook
  useEffect(() => {
    callFetchMore(conversationId, FETCH_LIMIT, new Date(), undefined)
      .then(gqlMessages => {
        setMessages(gqlMessages.reverse());
        setHasMore(gqlMessages.length > FETCH_LIMIT);
      });
  }, [callFetchMore, conversationId]);

  // connect for socket.io related
  useEffect(() => {
    let socket = io(`${process.env.REACT_APP_BASE_URL}/chat`, {
      transports: ['websocket'],
      auth: {
        token: currentUser.accessToken
      }
    });

    socket.on('connect', () => {
      socket.emit('listen', {conversationId: conversationId});
    });
    socket.on('reconnect', () => {
      socket.emit('listen', {conversationId: conversationId});
    });
    socket.on('new_message', event => {
      if(event.fromUserId !== currentUser.userId) {
        let incomingMessage: Message = {
          id: event.id,
          correlationId: event.correlationId,
          fromUser: {
            id: event.fromUserIdm
          },
          content: event.content,
          sentTime: event.sentTime,
        }
        setMessages(prev => [incomingMessage, ...prev]);
        return;
      }

      setMessages(prev => {
        let pendingMessage = prev.find(msg => msg.correlationId === event.correlationId);
        if (!pendingMessage) return [...prev];

        pendingMessage.id = event.id as string;
        pendingMessage.sentTime = event.sentTime as string;
        return [...prev];
      });
    });

    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUser.accessToken, currentUser.userId]);

  const handleSendMessage = (msg: string) => {
    sendMessage({variables: {conversationId: conversationId, content: msg}})
      .then(response => {
        let pendingMessage: Message = {
          correlationId: response.data?.sendMessage.correlationId,
          content: msg,
          fromUser: {
            id: currentUser.userId as string,
          },
        }
        setMessages(prev => [pendingMessage, ...prev]);
      })
      .catch(error => console.log(error));
  }

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <h1>{convInfo?.conversation.name || "Conversation"}</h1>
          <MessageList
            changeScrollDirection={changeScrollDirection}
            fetchMore={fetchMore}
            hasMore={hasMore}
            messages={messages}/>
          <MessageComposer onSend={handleSendMessage} disabled={false} placeholder={t("CHAT_MESSAGE_HINT")}/>
        </Grid>
      </Grid>
    </Container>
  );
}