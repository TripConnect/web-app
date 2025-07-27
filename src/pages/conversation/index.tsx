import {useCallback, useEffect, useState} from "react";
import MessageList from "./components/MessageList";
import {Message, ScrollDirection} from "./state";
import {graphql} from "../../gql";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";

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

  const [fetchMoreType, setFetchMoreType] = useState<"before" | "after">("before");
  const [messages, setMessages] = useState<Message[]>([]);

  const changeScrollDirection = useCallback((direction: ScrollDirection) => {
    if(fetchMoreType === "before" && direction === "up") return;
    if(fetchMoreType === "after" && direction === "down") return;

    setFetchMoreType(direction === "up" ? "before" : "after");
  }, [fetchMoreType]);

  useEffect(() => {
    fetchMore();
  }, []);

  const { data: convInfo } = useQuery(INIT_UI_QUERY, {
    variables: {
      id: conversationId,
    }
  });

  const MAX = 500;
  const hasMore = messages.length < MAX;

  const fetchMore = () => {
    setTimeout(() => {
      setMessages(prev => {
        const older: Message[] = Array.from(
          { length: FETCH_LIMIT },
          (_, i): Message => ({
            id: window.self.crypto.randomUUID().toString(),
            content: "Message from " + new Date().toISOString(),
            createdAt: new Date().toISOString(),
            fromUser: {
              id: window.self.crypto.randomUUID(),
            }
          })
        );
        return [...prev, ...older];
      });
    }, 500);
  };

  return (
    <div>
      <h1>Conversation</h1>
      <MessageList
          changeScrollDirection={changeScrollDirection}
          fetchMore={fetchMore}
          hasMore={hasMore}
          messages={messages} />
    </div>
  );
}