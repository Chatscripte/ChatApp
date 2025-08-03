import { Box, Grid, List, ListItem, ListItemText, Paper, ListItemButton } from '@mui/material';
import  { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AddGroup from './AddGroup';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';
import { useChatContext } from '../hooks/useChatContext';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Sidebar({ setIsChatOpend, setCurrentChat , setAllChats , allChats }: any) {
    const [isWantCreateGroup, setIsWantCreateGroup] = useState<boolean>(false);
    const { chatMembers } = useChatContext();
     useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit(SOCKET_EVENTS.CHAT_GET_ALL, (data: any) => {
            setAllChats(data.chats);
        });
        return () => {
            socket.off(SOCKET_EVENTS.CHAT_GET_ALL);
        }
    }, [chatMembers])
    return (
        <Grid item xs={12} className="sidebar desktop-sidebar">
            <Paper elevation={3} className="sidebar-paper">
                {
                    isWantCreateGroup ?
                        // If user wants to create a group, show the AddGroup component
                        <AddGroup setIsWantCreateGroup={setIsWantCreateGroup} />
                        :
                        <>
                            <Box className="search-bar-container">
                                <SearchIcon className='search-icon' />
                                <input type="text" className='search-bar' placeholder='Search...' />
                            </Box>
                            <Box className="chats-types">
                                <GroupAddIcon onClick={() => setIsWantCreateGroup(true)} />
                            </Box>
                            <List className="conversation-list">
                                {allChats?.map((conv) => (
                                    <ListItem key={conv._id} className="conversation-item">
                                        <ListItemButton onClick={() => {
                                            setIsChatOpend(true)
                                            setCurrentChat(conv)
                                        }}>
                                            <div className='avatar'>
                                                <img src={`${conv.profile}`} alt={conv.title} />
                                                <ListItemText
                                                    primary={conv.title}
                                                    secondary={
                                                        <>
                                                            {/* <Typography variant="body2" className="last-message">
                                                                            {conv.lastMessage}
                                                                        </Typography> */}
                                                            <span className="unread-count">2</span>
                                                            <DoneAllIcon className='check-icon' />
                                                        </>
                                                    }
                                                />
                                                {/* <Typography variant="caption" className="time">
                                                                {conv.time}
                                                            </Typography> */}
                                            </div>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                }
            </Paper>
        </Grid>
    )
}

export default Sidebar
