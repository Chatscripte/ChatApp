import { Box, Grid, List, Paper } from '@mui/material';
import { useDeferredValue, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from './SearchResults';
import AddGroup from './AddGroup';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';
import { useChatContext } from '../hooks/useChatContext';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatItem from './ChatItem';
import CloseIcon from '@mui/icons-material/Close';

interface SidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAllChats: React.Dispatch<React.SetStateAction<any>>;
    allChats: { _id: string, title: string, profile?: string }[];
}

function Sidebar({ setAllChats, allChats }: SidebarProps) {
    const [isWantCreateGroup, setIsWantCreateGroup] = useState<boolean>(false);
    const { setChatInfo, isCreatedGroup, isSearchingChats, setIsSearchingChats } = useChatContext();
    const [query, setQuery] = useState<string>('');
    const searchedValue = useDeferredValue(query);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit(SOCKET_EVENTS.CHAT_GET_ALL, (data: any) => {
            setAllChats(data.chats);
        });
        return () => {
            socket.off(SOCKET_EVENTS.CHAT_GET_ALL);
        }
    }, [isCreatedGroup])

    // Function to get chat information
    const getChatInfo = (chatID: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit(SOCKET_EVENTS.CHAT_GET_ONE, { chatID }, (data: any) => {
            if (data.success) {
                setChatInfo(data.chat);
            }
        });
    }

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
                                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className='search-bar' placeholder='Search...' />
                                {
                                    isSearchingChats &&
                                    <CloseIcon onClick={() => {
                                        setQuery('')
                                        setIsSearchingChats(false)
                                    }} className='close-icon' />
                                }
                            </Box>
                            <SearchResults query={searchedValue} />
                            <Box className="chats-types">
                                <GroupAddIcon onClick={() => setIsWantCreateGroup(true)} />
                            </Box>
                            {
                                !isSearchingChats &&
                                <List className="conversation-list">
                                    {allChats?.map((conv, index) => (
                                        <ChatItem key={conv?._id || index} conv={conv}
                                            getChatInfo={getChatInfo} />
                                    ))}
                                </List>
                            }
                        </>
                }
            </Paper>
        </Grid>
    )
}

export default Sidebar
