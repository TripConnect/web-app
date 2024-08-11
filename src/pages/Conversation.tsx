import { useLocation, useParams } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { CHAT_MESSAGE_EVENT } from "constants/socket";
import { ChatMessageModel } from 'types/chat';
import { CHAT_HISTORY_PAGE_SIZE, INCOMING_CHAT_MESSAGE_CHANNEL } from "constants/common";
import { useTranslation } from "react-i18next";

const QUERY_CONVERSATION_SUMMARY = gql`
    query Conversation($id: String!) {
        conversation(id: $id) {
            name
            type
            members {
                id
                displayName
            }
        }
    }
`;

const QUERY_CHAT_HISTORY = gql`
    query Conversation($id: String!, $page: Int, $limit: Int) {
        conversation(id: $id) {
            messages(messagePage: $page, messageLimit: $limit) {
                id
                messageContent
                fromUser {
                    id
                    avatar
                    displayName
                }
                createdAt
            }
        }
    }
`;

const SEARCH_USER_QUERY = gql`
    query Users($searchTerm: String!) {
        users(searchTerm: $searchTerm) {
            id
            displayName
        }
    }
`;

function Message({ id, content, createdAt, isMine }: { id: string, content: string, createdAt: number, isMine: boolean }) {
    return (
        <div key={id} style={{
            minWidth: "3%",
            maxWidth: "75%",
            boxSizing: "border-box",
            alignSelf: isMine ? "flex-end" : "flex-start",
            background: isMine ? "lightblue" : "lightgray",
            borderRadius: "0.5rem",
            wordWrap: "break-word",
            margin: "0.1vw 0",
            padding: "0.15rem 1rem",
        }}>
            <span>{content}</span>
        </div>
    );
}

export default function Conversation() {
  const { id: currentConversationId } = useParams<{id: string}>();
  const dispatch = useDispatch();
  
  const { t } = useTranslation();
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(-1);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessageHistory, setChatMessageHistory] = useState<ChatMessageModel[]>([]);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [incomingChatMessageChannel, setIncomingChatMessageChannel] = useState(new BroadcastChannel(INCOMING_CHAT_MESSAGE_CHANNEL));

  const chatSocket = useSelector((state: any) => state.socket.socket);
  const currentUser = useSelector((state: any) => state.user);

  const [searchUser, { loading: searchUSerloading, error: searchUserError, data: searchUserData }] = useLazyQuery(SEARCH_USER_QUERY);
  const [fetchChatSummary, { loading: fetchChatSummaryLoading, error: fetchChatSummaryError, data: fetchChatSummaryData }] = useLazyQuery(QUERY_CONVERSATION_SUMMARY);
  const [fetchChatHistory, { loading: fetchChatHistoryLoading, error: fetchChatHistoryError, data: fetchChatHistoryData }] = useLazyQuery(QUERY_CHAT_HISTORY);


  incomingChatMessageChannel.addEventListener('message', (event: MessageEvent) => {
    let incomingMessage: ChatMessageModel = event.data;
    setChatMessageHistory([...chatMessageHistory, incomingMessage]);
  });

  useLayoutEffect(() => {
    if (conversationRef.current) {
      console.log('scrolling to bottom');
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    fetchChatHistory({
      variables: {
        id: currentConversationId,
        page: currentPage,
        limit: CHAT_HISTORY_PAGE_SIZE
      }
    }).then(data => {
      let messages: ChatMessageModel[] = data.data.conversation.messages.map((m: any) => ({
        id: m.id,
        conversationId: currentConversationId,
        fromUserId: m.fromUser.id,
        content: m.messageContent,
        createdAt: m.createdAt,
      }));
      setChatMessageHistory(messages);
    });
  }, [currentPage]);

  useEffect(() =>{
    fetchChatSummary({
      variables: {
        id: currentConversationId
      }
    });
  }, []);


  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  }

  const handleSendMessage = () => {
    chatSocket.emit(CHAT_MESSAGE_EVENT, {
      conversationId: currentConversationId,
      content: chatMessage
    });
    setChatMessage("");
  }

  const handleSearchUserChange = (e: any) => {
    clearTimeout(timeoutId as number);
    if (e.target.value.length === 0) {
      return;
    }
    setTimeoutId(
      setTimeout(() => {
        searchUser({ variables: { searchTerm: e.target.value } });
      }, 800)
    );
  }


  return (
    <Grid container justifyContent='center'>
      {/* Sidebar */}
      {/* <Grid item xs={4} style={{ background: "#eee", padding: 10 }}>
        <Grid container>
          <Grid item sm={12}>
            <Typography variant="caption" style={{
              fontWeight: 600,
              fontSize: '1.75rem',
              marginBottom: 10,
            }}>Conversations</Typography>
          </Grid>
          <Grid item sm={12}>
            <TextField
                label="Find user"
                id="find-user"
                variant="filled"
                size="small"
                style={{ paddingBottom: 12 }}
                onKeyUp={handleSearchUserChange}
            />
          </Grid>
          <Grid item sm={12}>
            <div>
              {
                searchUserData?.users && searchUserData.users
                  .map((searchedUser: any, index: number) => currentUser.userId !== searchedUser.id && (
                      <>
                        <div
                          key={`sidebarSearchUser-${searchedUser.id}`}
                          style={{ padding: 10, cursor: "pointer" }}
                        >
                          {searchedUser.displayName}
                        </div>
                        {index < searchUserData.users.length - 1 && <hr />}
                      </>
                  ))
              }
            </div>
          </Grid>
        </Grid>
      </Grid> */}

      {/* Main */}
      <Grid item xs={8}>
        <Grid container>
          <Grid item sm={12}>
            <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '10px 20px' }}>
              <Avatar
                alt="Avatar"
                variant="circular"
                src={
                  fetchChatSummaryData && (fetchChatSummaryData.conversation.members === 'PRIVATE' ?
                    fetchChatSummaryData.conversation.members
                      .find(((m: any) => m.id !== currentUser.userId))
                      .avatar :
                    currentUser.avatar)
                }
                sx={{ width: 60, height: 60, objectFit: 'cover' }}
              />
              <Typography variant="caption" style={{
                marginLeft: 10,
                fontWeight: 600,
                fontSize: '1.5rem',
                padding: 10,
                alignContent: 'start',
              }}>
                {fetchChatSummaryLoading && "Loading..."}
                {
                  fetchChatSummaryData && fetchChatSummaryData.conversation.members
                    .filter(((m: any) => m.id !== currentUser.userId))
                    .map((m: any) => m.displayName)
                    .join(', ')
                }
              </Typography>
            </div>
          </Grid>
          <Grid item sm={12}>
            <div
              ref={conversationRef} 
              style={{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: "100%",
                height: "75vh",
                padding: "0.5vw",
                overflow: "auto",
            }}>
              {fetchChatHistoryLoading && "Loading..."}
              {chatMessageHistory.length > 0 && chatMessageHistory
                .map((message: ChatMessageModel) => <Message 
                  key={message.id} 
                  id={message.id} 
                  content={message.content} 
                  createdAt={message.createdAt} 
                  isMine={message.fromUserId === currentUser.userId} />)}
            </div>
          </Grid>
          <Grid item sm={12}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: '20px 0',
            }}>
                <TextField
                  placeholder={t('CHAT_MESSAGE_HINT')}
                  id="filled-hidden-label-small"
                  autoComplete='off'
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={chatMessage}
                  onChange={handleChangeMessage}
                  style={{ marginRight: 8 }} 
                />
                <IconButton color="primary" onClick={handleSendMessage} disabled={chatMessage.length === 0}>
                  <SendIcon />
                </IconButton>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}