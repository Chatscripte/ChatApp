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

interface ChatTemplateProps {
    isChatOpend: boolean,
    currentChat: { _id: string, title: string, profile: string } | null,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isDrawerOpen: boolean
}

function ChatTemplate({ isChatOpend, currentChat, setIsDrawerOpen, isDrawerOpen }: ChatTemplateProps) {
    const [message, setMessage] = useState('');

    useEffect(() => {
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
    // Mock data for chat messages
    const messages = [
        { id: 1, sender: 'John Doe', text: 'Hey, how are you?', time: '10:30 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Doing great, thanks!', time: '10:32 AM', isSent: true },
        { id: 3, sender: 'John Doe', text: 'Cool, want to grab coffee?', time: '10:35 AM', isSent: false },
    ];
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
                            {messages.map((msg) => (
                                <Box
                                    key={msg.id}
                                    className={`message ${msg.isSent ? 'sent' : 'received'}`}
                                >
                                    <Typography variant="body2" className="message-sender">
                                        {msg.sender}
                                    </Typography>
                                    <Paper className="message-bubble">
                                        <Typography variant="body1">{msg.text}</Typography>
                                        <Typography variant="caption" className="message-time">
                                            {msg.time}
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
