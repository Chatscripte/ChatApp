import { Box, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useChatContext } from '../hooks/useChatContext'

interface SidebarDrawerProps {
    isDrawerOpen: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleDrawer: () => void;
}


function SidebarDrawer({ isDrawerOpen, setIsDrawerOpen, toggleDrawer }: SidebarDrawerProps) {
    const { allChats } = useChatContext();
    return (
        <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="mobile-sidebar">
            <Box className="sidebar-paper">
                <Typography variant="h6" className="sidebar-title">
                    Chats
                </Typography>
                <List className="conversation-list">
                    {allChats.length > 0 && allChats?.map((conv) => (
                        <ListItem
                            key={conv._id}
                            className="conversation-item"
                            onClick={toggleDrawer}
                            component="div"
                        >
                            <ListItemText
                                primary={conv.title}
                                secondary={
                                    <>
                                        {/* <Typography variant="body2" className="last-message">
                                                    {conv.lastMessage}
                                                </Typography>
                                                <Typography variant="caption" className="time">
                                                    {conv.time}
                                                </Typography> */}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    )
}

export default SidebarDrawer
