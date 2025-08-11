import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useChatContext } from '../hooks/useChatContext';

interface ChatItemProps {
    conv?: { _id: string, title: string, profile?: string },
    setIsChatOpend?: (value: boolean) => void,
    setCurrentChat?: (value: { _id: string, title: string, profile?: string }) => void,
    getChatInfo?: (value: string) => void,
}

function ChatItem({ conv, getChatInfo }: ChatItemProps) {
    const { setIsChatOpend, setCurrentChat } = useChatContext();
    return (
        <ListItem key={conv?._id} className="conversation-item">
            <ListItemButton className='conversation-item-button' onClick={() => {
                if (conv && setIsChatOpend && setCurrentChat && getChatInfo) {
                    setIsChatOpend(true)
                    setCurrentChat({ ...conv, profile: conv.profile ?? '' })
                    getChatInfo(conv._id)
                }
            }}>
                <div className='avatar'>
                    {
                        conv?.profile ?
                            <img src={`${conv.profile}`} alt={conv.title} className='avatar-image' />
                            :
                            <div className='avatar-icon'>
                                <PeopleAltIcon />
                            </div>
                    }
                    <ListItemText
                        primary={conv?.title}
                        secondary={
                            <>
                                <Typography variant="body2" className="last-message">
                                    it is ok
                                </Typography>
                                <span className="unread-count">2</span>
                            </>
                        }
                    />
                    <DoneAllIcon className='check-icon' />
                    <Typography variant="caption" className="time">
                        10:30 AM
                    </Typography>
                </div>
            </ListItemButton>
        </ListItem>
    )
}

export default ChatItem
