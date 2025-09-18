import { useEffect, useRef, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { getCookie, parseToken } from '../lib/helper';
import { useAuth } from '../hooks/useAuth';
import MessageInput from './MessageInput';
import MessagesArea from './MessagesArea';
import type { ChatTemplateProps, Message } from '../types';
import ChatHeader from './ChatHeader';
import { useChatContext } from '../hooks/useChatContext';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';


function ChatTemplate({ setIsDrawerOpen, isDrawerOpen }: ChatTemplateProps) {
    const { currentUser, setCurrentUser } = useAuth();
    const accessToken = getCookie('accessToken');
    const [messages, setMessages] = useState<Message[]>([]); // Combine chatInfo.messages and newMessages
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // For auto-scrolling to latest message
    const { currentChat, isChatOpend , currentChatInfos } = useChatContext();


    useEffect(() => {
        if (accessToken) {
            const parsedToken = parseToken(accessToken);
            setCurrentUser?.(parsedToken);
        }
    }, [accessToken, setCurrentUser]);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        if(isChatOpend) {
            socket.on(SOCKET_EVENTS.CHAT_GET_ONLINE_USERS, (onlineUsers) => {
                console.log('Online users:', onlineUsers);
            });
            currentChatInfos?.messages?.map(msg => {
               return  socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {messageID: msg._id} ,(data) => {
                console.log(data)
                 return data
                })
            })
        }
    }, [isChatOpend , currentChat]);

    return (
        <Grid item xs={12} className="chat-area">
            {isChatOpend ? (
                <Paper elevation={3} className="chat-paper">
                    {/* Chat Header */}
                    <ChatHeader currentChat={currentChat} toggleDrawer={toggleDrawer} />
                    {/* Messages Area */}
                    <MessagesArea messages={messages} messagesEndRef={messagesEndRef} currentUser={currentUser} />
                    {/* Message Input */}
                    <MessageInput messagesEndRef={messagesEndRef} messages={messages} setMessages={setMessages} currentChat={currentChat} />
                </Paper>
            ) : (
                <div className="empty-chats-tem">
                    <p>select a chat to start messaging</p>
                    <AssignmentAddIcon />
                </div>
            )}
        </Grid>
    );
}

export default ChatTemplate;