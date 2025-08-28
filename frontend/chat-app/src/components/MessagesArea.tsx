import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import type { Message } from '../types';
import { Link } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import '../styles/MessageArea.scss';
import { useShowPopups } from '../hooks/useShowPopups';
import SelectLocationPopup from '../popups/SelectLocationPopup';
import { useCallback, useEffect, useState } from 'react';
import { getMapUrls, isMobile } from '../lib/helper';

interface ChatTemplateProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    currentUser: { userID: string; iat: number; exp: number } | null | undefined;
}

function MessagesArea({ messages, messagesEndRef, currentUser }: ChatTemplateProps) {
    const { isShowLocationPopup } = useShowPopups();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filteredLocationMessages, setFilteredLocationMessages] = useState<Message[]>([]);
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

    const getStaticMap = async (msg: Message) => {
        try {
            setLoadingStates((prev) => ({ ...prev, [msg._id]: true }));
            const res = await fetch(
                `https://api.neshan.org/v4/static?key=${import.meta.env.VITE_NESHAN_ALL_SERVICES_API_KEY
                }&type=neshan&width=500&height=500&zoom=12&center=${msg.location?.lat},${msg.location?.long
                }&markerToken=${import.meta.env.VITE_NESHAN_MARKER_TOKEN}`
            );
            if (res.ok) {
                const blob = await res.blob();
                const imageUrl = URL.createObjectURL(blob);
                setLoadingStates((prev) => ({ ...prev, [msg._id]: false }));
                return imageUrl;
            } else {
                const errorData = await res.text();
                console.error('Response not OK:', res.status, errorData);
                setLoadingStates((prev) => ({ ...prev, [msg._id]: false }));
                return null;
            }
        } catch (error) {
            console.error('Error fetching static map:', error);
            setLoadingStates((prev) => ({ ...prev, [msg._id]: false }));
            return null;
        }
    };

    const filterLocationMessages = useCallback(async () => {
        const locationMessages = messages.filter((msg) => msg.location);
        const updatedMessages = await Promise.all(
            locationMessages.map(async (msg) => {
                const staticImageLocation = await getStaticMap(msg);
                return { ...msg, staticImageLocation }; // Create a new object with the updated property
            })
        );
        setFilteredLocationMessages(updatedMessages as Message[]);
    }, [messages]);

    useEffect(() => {
        filterLocationMessages();
    }, [messages, filterLocationMessages]);

    const acceptedFiles = (msg: Message) => {
        return (
            msg.fileUrl &&
            !msg.location &&
            (msg.fileUrl.endsWith('.jpg') ||
                msg.fileUrl.endsWith('.png') ||
                msg.fileUrl.endsWith('.jpeg') ||
                msg.fileUrl.endsWith('.gif') ||
                msg.fileUrl.endsWith('.mp4'))
        );
    };

    const handleMapClick = (location: { lat: number | undefined; lng: number | undefined }, event: React.MouseEvent) => {
        event.preventDefault();
        const { primary, fallback } = getMapUrls(location);
        if (isMobile()) {
            // Try primary (Neshan app)
            window.location.href = primary;
            // Set timeout to fall back to Google Maps if app doesn't open
            setTimeout(() => {
                window.location.href = fallback;
            }, 1000);
        } else {
            // Open web URL directly
            window.open(primary, '_blank', 'noopener,noreferrer');
        }
    };

    const renderMessageContent = (msg: Message, filteredLocationMessages: Message[]) => {
        if (msg.fileUrl) {
            return (
                <Box className="message-file">
                    <Link to={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                        {acceptedFiles(msg) ? (
                            msg.fileUrl.endsWith('.mp4') ? (
                                <video
                                    controls
                                    style={{ maxWidth: '100%', maxHeight: '100%', width: '300px', height: 'auto' }}
                                    className="message-video"
                                >
                                    <source src={msg.fileUrl} type="video/mp4" />
                                </video>
                            ) : (
                                <img
                                    src={msg.fileUrl}
                                    style={{ maxWidth: '100%', maxHeight: '100%', width: '300px', height: 'auto' }}
                                    alt="Attached file"
                                    className="message-image"
                                />
                            )
                        ) : (
                            <Box className="message-file-info">
                                <Box className="message-file">
                                    <div className="file-icon">
                                        <InsertDriveFileIcon />
                                    </div>
                                    <div>
                                        <Typography variant="body2" className="message-file-name">
                                            {msg.fileUrl.substring(msg.fileUrl.lastIndexOf('/') + 1)}
                                        </Typography>
                                        <Typography variant="caption" className="message-file-type">
                                            22.5kb
                                        </Typography>
                                    </div>
                                </Box>
                            </Box>
                        )}
                    </Link>
                </Box>
            );
        }
        if (msg.location && !msg.fileUrl && !msg.text) {
            return filteredLocationMessages.map((msg) => {
                return (
                    <Box className="message-file">
                        {loadingStates[msg._id] ? (
                            <CircularProgress style={{ color: 'green' }} />
                        ) : msg.staticImageLocation ? (
                            <Link to={'#'} onClick={(e) => handleMapClick({ lat: msg?.location?.lat, lng: msg?.location?.long }, e)}>
                                <img
                                    src={msg.staticImageLocation}
                                    style={{ maxWidth: '100%', maxHeight: '100%', width: '300px', height: 'auto' }}
                                    alt="Location Map"
                                    className="message-image"
                                />
                            </Link>
                        ) : (
                            <Typography variant="body2" color="error">
                                Failed to load map
                            </Typography>
                        )}
                    </Box>
                );
            })
        }
        return null;
    };

    useEffect(() => {
        return () => {
            filteredLocationMessages.forEach((msg) => {
                if (msg.staticImageLocation) {
                    URL.revokeObjectURL(msg.staticImageLocation);
                }
            });
        };
    }, [filteredLocationMessages]);

    return (
        <>
            {isShowLocationPopup && <SelectLocationPopup />}
            <Box className="messages" sx={{ overflowY: 'auto', maxHeight: '100vh' }}>
                {messages.map((msg) => (
                    <Box
                        key={msg._id}
                        className={`message ${msg.sender._id === currentUser?.userID ? 'sent' : 'received'}`}
                    >
                        <Typography variant="body2" className="message-sender">
                            {msg.sender.username}
                        </Typography>
                        <Paper className="message-bubble">
                            <Typography variant="body1">{msg.text}</Typography>
                            {renderMessageContent(msg, filteredLocationMessages)}
                            <Typography variant="caption" className="message-time">
                                {msg.createdAt.substring(11, 16)}
                            </Typography>
                        </Paper>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
        </>
    );
}

export default MessagesArea;