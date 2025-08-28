import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useChatContext } from '../hooks/useChatContext';
import { useEffect, useState } from 'react';

interface ChatItemProps {
    conv?: { _id: string; title: string; profile?: string; type?: string };
    getChatInfo?: (value: string) => void;
}


function ChatItem({ conv, getChatInfo }: ChatItemProps) {
    const { chatInfo, setIsChatOpend, setCurrentChat, setCurrentChatInfos } = useChatContext();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (chatInfo && conv) {
            setUsername(chatInfo[conv?._id]?.members[1]?.user?.username ?? '');
        }
    }, [chatInfo, conv]);

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
                        primary={<span>{conv?.type === 'GROUP' ? conv.title : username}</span>}
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className="last-message"
                                >
                                    it is ok
                                </Typography>
                                <span className="unread-count">2</span>
                            </>
                        }
                    />
                    <DoneAllIcon className="check-icon" />
                    <Typography component="span" variant="caption" className="time">
                        10:30 AM
                    </Typography>
                </div>
            </ListItemButton>
        </ListItem>
    );
}

export default ChatItem;