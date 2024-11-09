import { useLocation, useParams } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { CHAT_MESSAGE_EVENT } from "constants/socket";
import { ChatMessageModel } from 'types/chat';
import { CHAT_HISTORY_PAGE_SIZE, INCOMING_CHAT_MESSAGE_CHANNEL } from "constants/common";
import { useTranslation } from "react-i18next";
import { RootState } from "store";
import { io, Socket } from "socket.io-client";

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
  query Conversation($id: String!, $messagePage: Int, $messageLimit: Int) {
    conversation(id: $id) {
      messages(messagePage: $messagePage, messageLimit: $messageLimit) {
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

interface ChatMessageProps {
  id: string;
  content: string;
  createdAt: number;
  owner: User;
}

const ChatMessage = memo(function ({ id, content, createdAt, owner }: ChatMessageProps) {
  const currentUser = useSelector((state: any) => state.user);
  let isMine = owner.id === currentUser.userId;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: "3%",
        maxWidth: "75%",
        alignSelf: isMine ? "flex-end" : "flex-start",
        boxSizing: "border-box",
        margin: "0.2vw 0",
      }}
    >
      {
        !isMine && <Avatar
          alt={`-avatar`}
          variant="circular"
          src={owner.avatar}
          sx={{ width: 30, height: 30, objectFit: 'cover', marginRight: 0.5 }} />
      }
      <span
        style={{
          wordWrap: "break-word",
          padding: "0.15rem 1rem",
          borderRadius: "0.5rem",
          background: isMine ? "lightblue" : "lightgray",
        }}
      >
        {!isMine && <div style={{ fontWeight: 500 }}>{owner.displayName}</div>}
        {content}
      </span>
    </div>
  );
}, (prevProps: ChatMessageProps, nextProps: ChatMessageProps) => prevProps.id === nextProps.id);

export default function Conversation() {
  const { id: currentConversationId } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isReachOldestPage, setIsReachOldestPage] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatMessageHistory, setChatMessageHistory] = useState<ChatMessageModel[]>([]);
  const conversationRef = useRef<HTMLDivElement>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  const [searchUser, { loading: searchUSerloading, error: searchUserError, data: searchUserData }] = useLazyQuery(SEARCH_USER_QUERY);
  const [fetchChatSummary, { loading: fetchChatSummaryLoading, error: fetchChatSummaryError, data: fetchChatSummaryData }] = useLazyQuery(QUERY_CONVERSATION_SUMMARY);
  const [fetchChatHistory, { loading: fetchChatHistoryLoading, error: fetchChatHistoryError, data: fetchChatHistoryData }] = useLazyQuery(QUERY_CHAT_HISTORY);

  useEffect(() => {
    fetchChatSummary({
      variables: {
        id: currentConversationId
      }
    });
  }, []);

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
    });
    connection.on('connect_error', err => {
      console.log(err.message);
    });
    connection.on('message', (payload: ChatMessageModel) => {
      refreshConversation();
    });
    setChatSocket(connection);
  }, []);

  useEffect(() => {
    if (!conversationRef.current) return;
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;

    const handleScroll = () => {
      if (!conversationRef.current) return;
      if (conversationRef.current.scrollTop === 0) {
        handleScrollToTop();
      }
    };
    conversationRef.current?.addEventListener('scrollend', handleScroll);
  }, []);

  useEffect(() => {
    fetchChatHistoryByPage(currentPage)
      .then((respMessages: ChatMessageModel[]) => {
        let isOldestPage = respMessages.length === 0;
        setIsReachOldestPage(isOldestPage);
        if (!isOldestPage) setChatMessageHistory(prevMessages => currentPage === 1 ? respMessages : [...respMessages, ...prevMessages]);
      })
      .catch(err => {
        console.error(err);
      });
  }, [currentPage]);


  const fetchChatHistoryByPage = async (pageNum: number): Promise<ChatMessageModel[]> => {
    console.log('fetch chat history by page: ' + pageNum);

    let resp = await fetchChatHistory({
      variables: {
        id: currentConversationId,
        messagePage: pageNum,
        messageLimit: CHAT_HISTORY_PAGE_SIZE
      }
    });

    let messages: ChatMessageModel[] = resp.data.conversation.messages
      .map((m: any): ChatMessageModel => ({
        id: m.id,
        conversationId: currentConversationId as string,
        owner: {
          id: m.fromUser.id,
          avatar: m.fromUser.avatar,
          displayName: m.fromUser.displayName,
        },
        content: m.messageContent,
        createdAt: m.createdAt,
      }))
      .reverse();

    return messages;
  }

  const handleScrollToTop = () => {
    if (isReachOldestPage) return;
    if (fetchChatHistoryLoading) return;
    setCurrentPage(currentPage + 1);
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  }

  const refreshConversation = () => {
    // If currentPage > 1, just reset currentPage to trigger currentPage-based useEffect. Otherwise, force reset all related states.
    if (currentPage > 1) {
      setCurrentPage(1);
    } else {
      fetchChatHistoryByPage(1)
        .then((respMessages: ChatMessageModel[]) => {
          setCurrentPage(1);
          setIsReachOldestPage(false);
          setChatMessageHistory(respMessages);
        })
        .catch(err => {
          console.error(err);
        });
    }
    if (conversationRef.current) conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }

  const handleSendMessage = () => {
    chatSocket?.emit(CHAT_MESSAGE_EVENT, {
      conversationId: currentConversationId,
      content: chatMessage
    }, (response: { status: 'DONE' | 'FAILED' }) => {
      console.log('Send chat message:' + response.status);
      setChatMessage('');
      refreshConversation();
    });
  }

  // const handleSearchUserChange = (e: any) => {
  //   clearTimeout(timeoutId as number);
  //   if (e.target.value.length === 0) {
  //     return;
  //   }
  //   setTimeoutId(
  //     setTimeout(() => {
  //       searchUser({ variables: { searchTerm: e.target.value } });
  //     }, 800)
  //   );
  // }

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
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '10px 20px' }}>
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
                sx={{ width: 45, height: 45, objectFit: 'cover' }}
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
              key={currentConversationId}
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
                .map((message: ChatMessageModel) => <ChatMessage
                  // key={message.id}
                  id={message.id}
                  content={message.content}
                  createdAt={message.createdAt}
                  owner={message.owner} />
                )
              }
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