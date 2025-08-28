import { Box, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import type { ChatHeaderProps } from '../types';
import { useChatContext } from '../hooks/useChatContext';
import { useEffect } from 'react';



function ChatHeader({ currentChat, toggleDrawer }: ChatHeaderProps) {
    const { currentChatInfos } = useChatContext()

    useEffect(() => {
        console.log(currentChatInfos);
    }, [currentChatInfos])
   

    return (
        <Box className="chat-header">
            <IconButton className="mobile-menu-button" onClick={toggleDrawer} sx={{ display: { md: 'none' } }}>
                <MenuIcon />
            </IconButton>
            <div className="chat-header-info">
                <Typography variant="h6">{currentChat?.title ? currentChat?.title : currentChatInfos?.members[1]?.user?.username}</Typography>
                <Typography variant="caption">Online</Typography>
            </div>
            <div className="icons-header-right">
                <LocalPhoneIcon />
                <ManageSearchIcon />
                <VerticalSplitIcon />
            </div>
        </Box>
    )
}

export default ChatHeader
