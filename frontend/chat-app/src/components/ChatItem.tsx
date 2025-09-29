import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useChatContext } from '../hooks/useChatContext';
import { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';


interface ChatItemProps {
    conv?: { _id: string; title: string; profile?: string; type?: string };
    getChatInfo?: (value: string) => void;
    username?: ''
}

function ChatItem({ conv, getChatInfo , username  }: ChatItemProps) {
    const { chatInfo, setIsChatOpend, setCurrentChat, setCurrentChatInfos  ,  currentChat , currentChatInfos , lastMessage , setLastMessage } = useChatContext();

    const showLastMessageBaseOnType = (lastMessage) => {
        if (lastMessage?.location) {
            return <LocationOnIcon />
        }
        if (lastMessage?.text) {
            return  conv?.lastMessage.text.substring(0, 24) + "..."
        }
        if (lastMessage?.fileUrl) {
            const url = new URL(lastMessage?.fileUrl);
            const pathname = url.pathname;
            const filename = pathname.split('/').pop();
            const ext = filename.split('.').pop();
            switch (ext) {
                case 'mp4' : {
                    return <PlayCircleIcon />
                }
                case 'jpg' || 'png' || 'webp' || 'avif' || 'gift' : {
                    return <ImageIcon />
                }
                case 'docx' : {
                  return <InsertDriveFileIcon />
                }
            }
        }
    }

    useEffect(() => {
        showLastMessageBaseOnType(conv?.lastMessage)
     },[setCurrentChatInfos,currentChat])

    if (!conv) return null;

    return (
        <ListItem key={conv._id} className="conversation-item">
            <ListItemButton
                className="conversation-item-button"
                onClick={() => {
                    setIsChatOpend(true);
                    setCurrentChat({ ...conv, profile: conv.profile ?? '' });
                    if (chatInfo && conv && chatInfo[conv._id]) {
                        setCurrentChatInfos(chatInfo[conv._id]);
                    }
                    if (getChatInfo) {
                        getChatInfo(conv._id);
                    }
                }}>
                <div className="avatar">
                    {conv.profile ? (
                        <img src={conv.profile} alt={conv.title} className="avatar-image" />
                    ) : (
                        <div className="avatar-icon">
                            <PeopleAltIcon />
                        </div>
                    )}
                    <ListItemText
                        style={{maxWidth :'56px'}}
                        primary={<span style={{textWrap : 'wrap'}}>{conv?.type === 'GROUP' ? conv.title : username}</span>}
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className="last-message"
                                    sx={{maxWidth : '30px'}}
                                >
                                    {showLastMessageBaseOnType(conv?.lastMessage)}
                                </Typography>

                            </>
                        }
                    />
                    <span className="unread-count">2</span>
                    <DoneAllIcon className="check-icon" />
                    <Typography component="span" variant="caption" className="time">
                        {conv?.lastMessage?.createdAt?.substring(11,16)}
                    </Typography>
                </div>
            </ListItemButton>
        </ListItem>
    );
}

export default ChatItem;