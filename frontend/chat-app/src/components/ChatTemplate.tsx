import { useEffect, useState, useCallback, useRef } from 'react';
import { SOCKET_EVENTS } from '../enums';
import socket from '../lib/socket';
import { Box, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { useChatContext } from '../hooks/useChatContext';
import { getCookie, parseToken } from '../lib/helper';
import { useAuth } from '../hooks/useAuth';

interface ChatTemplateProps {
    isChatOpend: boolean;
    currentChat: { _id: string; title: string; profile: string } | null;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDrawerOpen: boolean;
}

interface Message {
    _id: string;
    createdAt: string;
    sender: { _id: string; username: string };
    text: string;
}

function ChatTemplate({ isChatOpend, currentChat, setIsDrawerOpen, isDrawerOpen }: ChatTemplateProps) {
    const [message, setMessage] = useState('');
    const { chatInfo } = useChatContext();
    const { currentUser, setCurrentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]); // Combine chatInfo.messages and newMessages
    const accessToken = getCookie('accessToken');
    const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling to latest message

    // Parse access token only once on mount or when accessToken changes
    useEffect(() => {
        if (accessToken) {
            const parsedToken = parseToken(accessToken);
            setCurrentUser?.(parsedToken);
        }
    }, [accessToken, setCurrentUser]);

    // Set up socket listener for incoming messages
    useEffect(() => {
        if (!currentChat?._id) return;

        // Initialize messages with chatInfo.messages
        setMessages(chatInfo?.messages || []);

        const handleMessage = (data: { data: { message: Message } }) => {
            if (data?.data?.message) {
                setMessages((prevMessages) => {
                    // Avoid duplicates by checking _id
                    if (prevMessages.some((msg) => msg._id === data.data.message._id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, data.data.message];
                });
            }
        };

        socket.on(SOCKET_EVENTS.CHAT_GET_MESSAGES, handleMessage);

        // Clean up listener on unmount or when currentChat changes
        return () => {
            socket.off(SOCKET_EVENTS.CHAT_GET_MESSAGES, handleMessage);
        };
    }, [currentChat?._id, chatInfo?.messages]);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Memoize sendMessage to prevent unnecessary rerenders
    const sendMessage = useCallback(() => {
        if (!message || !currentChat?._id) return;

        socket.emit(
            SOCKET_EVENTS.CHAT_SEND_MESSAGE,
            {
                chatID: currentChat._id,
                text: message,
            },
            (data: unknown) => {
                console.log('Message sent:', data);
                setMessage('');
            }
        );
    }, [message, currentChat?._id]);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <Grid item xs={12} className="chat-area">
            {isChatOpend ? (
                <Paper elevation={3} className="chat-paper">
                    {/* Chat Header */}
                    <Box className="chat-header">
                        <IconButton className="mobile-menu-button" onClick={toggleDrawer} sx={{ display: { md: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <div className="chat-header-info">
                            <Typography variant="h6">{currentChat?.title}</Typography>
                            <Typography variant="caption">Online</Typography>
                        </div>
                        <div className="icons-header-right">
                            <LocalPhoneIcon />
                            <ManageSearchIcon />
                            <VerticalSplitIcon />
                        </div>
                    </Box>
                    {/* Messages Area */}
                    <Box className="messages" sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
                        {messages.map((msg) => (
                            <Box
                                key={msg._id}
                                className={`message ${msg.sender._id === currentUser?.userID ? 'sent' : 'received'}`}
                            >
                                <Typography variant="body2" className="message-sender">
                                    {msg.sender.username}
                                </Typography>
                                <Paper className="message-bubble">
                                    <Typography variant="body1">{msg.text}</Typography>
                                    <Typography variant="caption" className="message-time">
                                        {msg.createdAt.substring(11, 16)}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Message Input */}
                    <Box className="message-input">
                        <AttachFileIcon className="attach-icon" />
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            className="input-field"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <SendIcon className="send-icon" onClick={sendMessage} />
                    </Box>
                </Paper>
            ) : (
                <div className="empty-chats-tem">
                    <p>You don't have any chat yet, start here</p>
                    <AssignmentAddIcon />
                </div>
            )}
        </Grid>
    );
}

export default ChatTemplate;