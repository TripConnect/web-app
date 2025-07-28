import {useCallback, useEffect, useState} from "react";
import MessageList from "./components/MessageList";
import {Message, ScrollDirection} from "./state";
import {graphql} from "../../gql";
import {useParams} from "react-router-dom";
import {useLazyQuery, useQuery} from "@apollo/client";
import MessageComposer from "./components/MessageComposer";
import {useTranslation} from "react-i18next";

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
              fromUser {
                  id
                  displayName
                  avatar
              }
          }
      }
    }
`);

export default function Conversation() {
  const { id: conversationId = "" } = useParams<{ id: string }>();

  // common hooks
  const { t } = useTranslation();
  const [fetchMoreType, setFetchMoreType] = useState<"before" | "after">("before");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // debounce hooks
  const changeScrollDirection = useCallback((direction: ScrollDirection) => {
    if(fetchMoreType === "before" && direction === "up") return;
    if(fetchMoreType === "after" && direction === "down") return;

    setFetchMoreType(direction === "up" ? "before" : "after");
  }, [fetchMoreType]);

  // graphql hooks
  const { data: convInfo } = useQuery(INIT_UI_QUERY, {
    variables: {
      id: conversationId,
    }
  });
  const [fetchMessage, { loading :fetchMessageLoading, error: fetchMessageError, data: fetchMessageData }] = useLazyQuery(FETCH_MESSAGE_QUERY);

  // action definitions
  const fetchMore = useCallback(() => {
    let before, after: Date | null = null;
    if(fetchMoreType === "before") {
      before = messages.length ?
        new Date(Math.min(...messages.map(msg => +new Date(msg.createdAt)))) : +new Date();
    } else {
      after = new Date(Math.max(...messages.map(msg => +new Date(msg.createdAt))));
    }
    fetchMessage({variables: {
        id: conversationId,
        before: before,
        after: after,
        limit: FETCH_LIMIT
    }})
      .then(response => {
        let msgList = response.data?.conversation.messages;
        if(!msgList || msgList.length < FETCH_LIMIT) {
          setHasMore(false);
          return;
        }

        let msgState = msgList.map((msg): Message => ({
          id: msg.id,
          fromUser: msg.fromUser,
          content: msg.content,
          createdAt: msg.createdAt,
        }));

        if(fetchMoreType === "before") {
          setMessages(prev => [...msgState, ...prev]);
        } else {
          setMessages(prev => [...prev, ...msgState]);
        }

        setHasMore(true);
      })
  }, [conversationId, fetchMessage, fetchMoreType, messages]);

  // effect hook
  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  const sendMessage = (msg: string) => {
    console.log(msg)
  }

  return (
    <div>
      <h1>{convInfo?.conversation.name || "Conversation"}</h1>
      <MessageList
          changeScrollDirection={changeScrollDirection}
          fetchMore={fetchMore}
          hasMore={hasMore}
          messages={messages} />
      <MessageComposer onSend={sendMessage} disabled={false} placeholder={t("CHAT_MESSAGE_HINT")} />
    </div>
  );
}