import { useEffect, useState } from 'react'
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
    isChatOpend: boolean,
    currentChat: { _id: string, title: string, profile: string } | null,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isDrawerOpen: boolean
}

function ChatTemplate({ isChatOpend, currentChat, setIsDrawerOpen, isDrawerOpen }: ChatTemplateProps) {
    const [message, setMessage] = useState('');
    const {chatInfo} = useChatContext();
    const { currentUser, setCurrentUser } = useAuth();
    const accessToken = getCookie('accessToken');
      
    useEffect(() => {
        if (accessToken) {
            const parsedToken = parseToken(accessToken);
            setCurrentUser(parsedToken);
        }
    },[accessToken])
    
    useEffect(() => {
        console.log('get message');
        socket.on(SOCKET_EVENTS.CHAT_GET_MESSAGES, (data) => {
            console.log('Received messages:', data);
            // Handle incoming messages
        });
        return () => {
            socket.off(SOCKET_EVENTS.CHAT_GET_MESSAGES);
        }
    }, []);
    
    const sendMessage = () => {
        if (!message) return;
        // Send the message to the server
        socket.emit(SOCKET_EVENTS.CHAT_SEND_MESSAGE, {
            chatID: currentChat?._id.toString(),
            text: message,
        }, (data: unknown) => {
            console.log('Message sent:', data);
            setMessage('');
        });
    }
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    return (
        <Grid item xs={12} className="chat-area">
            {
                isChatOpend ?
                    <Paper elevation={3} className="chat-paper ">
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
                        <Box className="messages">
                            {chatInfo?.messages?.map((msg) => (
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
                                            {msg.sender.createdAt.substring(11, 16)}
                                        </Typography>
                                    </Paper>
                                </Box>
                            ))}
                        </Box>
                        {/* Message Input */}
                        <Box className="message-input">
                            <AttachFileIcon className='attach-icon' />
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type a message..."
                                className="input-field"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <SendIcon className="send-icon" onClick={sendMessage} />
                        </Box>
                    </Paper>
                    :
                    <div className='empty-chats-tem'>
                        <p>you don't have any chat yet start here </p>
                        <AssignmentAddIcon />
                    </div>
            }
        </Grid>
    )
}

export default ChatTemplate
