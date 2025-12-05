import { useDeferredValue, useEffect, useState } from "react";
import {
    Modal,
    Box,
    TextField,
    List,
    ListItem,
    ListItemText,
    Typography,
    CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { postData } from "../data";
import { SOCKET_EVENTS } from "../enums";
import socket from "../lib/socket";
import { useChatContext } from "../hooks/useChatContext";
import { getChatInformation } from "../lib/helper";
import { useDebounce } from 'use-debounce';
import UserSearchSkeleton from "../components/UserSearchSkeleton";

interface SearchModalProps {
    open: boolean;
    handleClose: () => void;
}

interface user {
    _id: string;
    username: string;
    exactMatch: boolean;
}

const style = {
    position: "absolute" as const,
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    bgcolor: "#1e1e1e",
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    color: "#fff",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
};

function SearchModal({ open, handleClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 1000);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const searchedValue = useDeferredValue(query);
    const { setIsCreatedPv } = useChatContext();
    const { setIsChatOpend, allChats, setCurrentChatInfos, setCurrentChat } = useChatContext();
   
  useEffect(() => {
    if (!debouncedQuery) return;

    postData(`${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/search`, {
        keyword: debouncedQuery
    })
        .then((data) => {
            if (data.success) {
                setResults(data.data.users);
                setIsLoading(false);
            }
        })
}, [debouncedQuery]);

useEffect(() => {
    if (query) {
        setIsLoading(true);
    } else {
        setIsLoading(false);
        setResults([]);
    }
}, [query]);

    const handleUserSelect = async (user: User) => {
        socket.emit(
            SOCKET_EVENTS.CHAT_CREATE,
            { type: "pv", recipientUsername: user.username },
            async (response: { success: boolean; message?: string; data?: any }) => {
                setIsLoading(false);
                setIsChatOpend(true);
                if (response.success === false && response.message === "This chat already exists!") {
                    const mainChat = allChats?.find(chat => chat._id === response?.data?._id);
                    if (mainChat) {
                        setIsChatOpend(true);
                        const chatInfo = await getChatInformation(mainChat._id);
                        setCurrentChat(chatInfo.chatInfo)
                        setCurrentChatInfos(chatInfo)
                        handleClose();
                    }
                }
                if (response.success) {
                    setIsCreatedPv(true);
                    setIsChatOpend(true);
                    handleClose();
                } else {
                    setIsCreatedPv(false);
                    console.error(response.message);
                }
            }
        );
        socket?.on(SOCKET_EVENTS.CHAT_CREATED, (data) => {
            setCurrentChatInfos((prev) => ({
                ...prev,
                members: data?.chat?.members,
                chatInfo: data?.chat?.chatInfo ?? { _id: '', createdAt: '', inviteLink: '', owner: { _id: '', password: '', username: '' }, title: '', type: '' },
                messages: data?.chat?.messages ?? [],
            }))
        })
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {/* Search bar */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        borderBottom: "1px solid #333",
                    }}
                >
                    {
                        isLoading ? (
                            <CircularProgress size={24} sx={{ color: "#aaa" }} />
                        ) : <Search sx={{ mr: 1, color: "#aaa" }} />
                    }
                    <TextField
                        placeholder="users search..."
                        variant="standard"
                        fullWidth
                        InputProps={{
                            disableUnderline: true,
                            style: { color: "#fff" },
                        }}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Typography variant="body2" sx={{ color: "#aaa", ml: 2 }}>
                        esc
                    </Typography>
                </Box>
                {/* Results */}
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <Typography
                        variant="body2"
                        sx={{ px: 2, py: 1, color: "#aaa", fontSize: "0.8rem" }}
                    >
                        RECENT
                    </Typography>
                    <List disablePadding>
                        {
                            isLoading ? (<UserSearchSkeleton />) : (
                               results?.map((item, i) => (
                            <ListItem
                                key={i}
                                button
                                sx={{
                                    "&:hover": { bgcolor: "#2a2a2a" },
                                    borderBottom: "1px solid #222",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleUserSelect(item)}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ color: "#fff" }}>
                                            {item?.username}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        )))
                       }
                    </List>
                </Box>
            </Box>
        </Modal>
    );

}

export default SearchModal;
