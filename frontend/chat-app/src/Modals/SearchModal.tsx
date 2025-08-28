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
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchedValue = useDeferredValue(query);
    const { setIsCreatedPv } = useChatContext();

    const { setIsChatOpend } = useChatContext();

    useEffect(() => {
        if (!searchedValue) return;
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            postData(`${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/search`, { keyword: searchedValue })
                .then((data) => {
                    console.log(data);
                    if (data.success) {
                        setIsLoading(false);
                        setResults(data.data.users)
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error(error);
                });
        }, 5000);
        if (results.length === 0 && !isLoading) {
            setResults([]);
        }
        return () => clearTimeout(timeoutId);
    }, [searchedValue]);

    const handleUserSelect = (user: user) => {
        console.log('Selected User:', user._id);
        socket.emit(
            SOCKET_EVENTS.CHAT_CREATE,
            { type: 'pv', recipientUsername: user.username },
            (response: { success: boolean; message?: string; data?: unknown }) => {
                setIsLoading(false);
                console.log(response);
                if (response.success) {
                    // Handle successful user selection (e.g., open chat)
                    setIsCreatedPv(true);
                    setIsChatOpend(true);
                    handleClose();
                } else {
                    setIsCreatedPv(false);
                    console.error(response.message);
                }
            }
        );
    }

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
                        {results?.map((item, i) => (
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
                        ))}
                    </List>
                </Box>
            </Box>
        </Modal>
    );

}

export default SearchModal;
