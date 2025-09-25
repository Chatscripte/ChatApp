import { Box, Grid, List, Paper, Typography } from '@mui/material';
import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from './SearchResults';
import AddGroup from './AddGroup';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';
import { useChatContext } from '../hooks/useChatContext';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatItem from './ChatItem';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import SearchModal from '../Modals/SearchModal';


function Sidebar() {
    const [isWantCreateGroup, setIsWantCreateGroup] = useState(false);
    const {
        setChatInfo,
        chatInfo,
        isCreatedGroup,
        isSearchingChats,
        setIsSearchingChats,
        allChats,
        setAllChats,
        isCreatedPv,
    } = useChatContext();

    const [query, setQuery] = useState('');
    const searchedValue = useDeferredValue(query);
    const [isShowSearchingUser, setIsShowSearchingUser] = useState(false);
    const [recieverUsername , setRecieverUsername] = useState<{[id: 'string'] : string}>({});

    /** ✅ define getChatInfo once, memoized */
    const getChatInfo = useCallback(
        (chatID: string) => {
            socket.emit(SOCKET_EVENTS.CHAT_GET_ONE, { chatID }, (data: any) => {
                if (data.success) {
                    setChatInfo((prev) => ({ ...prev, [chatID]: data.chat }));
                }
            });
        },
        [setChatInfo]
    );

    const getCurrentUsername = (chatId) => {
        const currentChatUsername = chatInfo[chatId]?.members[1]?.user?.username
        setRecieverUsername((prev) => ({
            ...prev,
            [chatId] : currentChatUsername
        }))
    }

    useEffect(() => {
        allChats?.map(chat => getCurrentUsername(chat._id))
    },[chatInfo])

    /** ✅ fetch all chats whenever new group/pv is created */
    useEffect(() => {
        socket.emit(SOCKET_EVENTS.CHAT_GET_ALL, (data: any) => {
            if (data?.chats) {
                setAllChats(data.chats);
            }
        });
        return () => {
            socket.off(SOCKET_EVENTS.CHAT_GET_ALL);
        };
    }, [isCreatedGroup, isCreatedPv, setAllChats]);

    /** ✅ pre-fetch chat info for PV chats */
    useEffect(() => {
        allChats?.forEach((conv) => {
                getChatInfo(conv._id);
        });
    }, [allChats, getChatInfo,setAllChats]);

    return (
        <Grid item xs={12} className="sidebar desktop-sidebar">
            <Paper elevation={3} className="sidebar-paper">
                {isWantCreateGroup ? (
                    <AddGroup setIsWantCreateGroup={setIsWantCreateGroup} />
                ) : (
                    <>
                        {/* 🔍 Search bar */}
                        <Box className="search-bar-container">
                            <SearchIcon className="search-icon" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="search-bar"
                                placeholder="Search Chats..."
                            />
                            {isSearchingChats && (
                                <CloseIcon
                                    onClick={() => {
                                        setQuery('');
                                        setIsSearchingChats(false);
                                    }}
                                    className="close-icon"
                                />
                            )}
                        </Box>

                        {/* Search Results */}
                        <SearchResults query={searchedValue} />

                        {/* Chats list */}
                        {!isSearchingChats && (
                            <>
                                <Box className="chats-types">
                                    <GroupAddIcon
                                        onClick={() => setIsWantCreateGroup(true)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <div
                                        onClick={() => setIsShowSearchingUser(true)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <PeopleIcon />
                                        <Typography>Search Users</Typography>
                                    </div>
                                </Box>
                                <List className="conversation-list">
                                    {allChats?.map((conv) => (
                                        <ChatItem
                                            key={conv._id}
                                            conv={conv}
                                            getChatInfo={getChatInfo}
                                            username={recieverUsername[conv._id]}
                                        />
                                    ))}
                                </List>
                            </>
                        )}
                    </>
                )}
                {/* Modal */}
                {isShowSearchingUser && (
                    <SearchModal
                        open={isShowSearchingUser}
                        handleClose={() => setIsShowSearchingUser(false)}
                    />
                )}
            </Paper>
        </Grid>
    );
}

export default Sidebar;
