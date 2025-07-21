import { useState } from 'react';
import { Grid, Box, List, ListItem, ListItemText, TextField, Typography, Paper, Drawer, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import '../styles/ChatSystem.scss';

function ChatSystem() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Mock data for conversations
    const conversations = [
        { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', time: '10:30 AM' },
        { id: 2, name: 'Jane Smith', lastMessage: 'Meeting at 2 PM?', time: '9:15 AM' },
        { id: 3, name: 'Group Chat', lastMessage: 'Let’s plan the trip!', time: 'Yesterday' },
    ];

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
        <Box className="chat-system">
            <Grid container className="chat-container">
                {/* Sidebar: Conversation List (Desktop) */}
                <Grid item xs={12} className="sidebar desktop-sidebar">
                    <Paper elevation={3} className="sidebar-paper">
                        <Box className="search-bar-container">
                            <SearchIcon className='search-icon' />
                            <input type="text" className='search-bar' placeholder='Search...' />
                        </Box>
                        <List className="conversation-list">
                            {conversations.map((conv) => (
                                <ListItem key={conv.id} button className="conversation-item">
                                    <div className='avatar'>
                                        <img src={`https://i.pravatar.cc/150?img=${conv.id}`} alt={conv.name} />
                                        <ListItemText
                                            primary={conv.name}
                                            secondary={
                                                <>
                                                    <Typography variant="body2" className="last-message">
                                                        {conv.lastMessage}
                                                    </Typography>
                                                    <span className="unread-count">2</span>
                                                    <DoneAllIcon className='check-icon' />
                                                </>
                                            }
                                        />
                                        <Typography variant="caption" className="time">
                                            {conv.time}
                                        </Typography>
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Mobile Sidebar (Drawer) */}
                <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer} className="mobile-sidebar">
                    <Box className="sidebar-paper">
                        <Typography variant="h6" className="sidebar-title">
                            Chats
                        </Typography>
                        <List className="conversation-list">
                            {conversations.map((conv) => (
                                <ListItem key={conv.id} button className="conversation-item" onClick={toggleDrawer}>
                                    <ListItemText
                                        primary={conv.name}
                                        secondary={
                                            <>
                                                <Typography variant="body2" className="last-message">
                                                    {conv.lastMessage}
                                                </Typography>
                                                <Typography variant="caption" className="time">
                                                    {conv.time}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Main Chat Area */}
                <Grid item xs={12} className="chat-area">
                    <Paper elevation={3} className="chat-paper">
                        {/* Chat Header */}
                        <Box className="chat-header">
                            <IconButton className="mobile-menu-button" onClick={toggleDrawer} sx={{ display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <div className="chat-header-info">
                                <Typography variant="h6">John Doe</Typography>
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
                            />
                            <SendIcon className="send-icon" />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ChatSystem;