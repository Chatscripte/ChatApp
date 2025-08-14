import React, { useRef } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import CropOriginalOutlinedIcon from '@mui/icons-material/CropOriginalOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { SOCKET_EVENTS } from '../enums';
import socket from '../lib/socket';
import { getCookie } from '../lib/helper';
import { useChatContext } from '../hooks/useChatContext';
import { useShowPopups } from '../hooks/useShowPopups';

interface SendFileTypeProps {
    setIsSendFileTypeVisible: React.Dispatch<React.SetStateAction<boolean>>;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

function SendFileType({ setIsSendFileTypeVisible, setFile }: SendFileTypeProps) {
    const photoVideoInputRef = useRef<HTMLInputElement | null>(null);
    const documentInputRef = useRef<HTMLInputElement | null>(null);
    const locationInputRef = useRef<HTMLInputElement | null>(null);
    const { chatInfo } = useChatContext();
    const { setIsShowLocationPopup } = useShowPopups();

    // Trigger file input click
    const handleListItemClick = (inputRef: React.RefObject<HTMLInputElement | null>) => {
        inputRef.current?.click();
    };

    const uploadFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/message/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`,
                }
            })
            if (res.ok) {
                const data = await res.json();
                const { fileUrl } = data.data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                socket.emit(SOCKET_EVENTS.CHAT_SEND_MESSAGE, { chatID: chatInfo?.chatInfo._id, fileUrl }, (response: any) => {
                    console.log('File sent successfully:', response);
                    setFile(null);
                });
            } else {
                console.error('File upload failed:', res.statusText);
            }
        } catch (error) {
            console.error('Error sending file:', error);
        }
    }

    const handleLocationClick = () => {
        // Example: Log a message or use Geolocation API
        console.log('Location clicked - implement geolocation or other logic here');
        setIsShowLocationPopup(true); // Show the location popup
        setIsSendFileTypeVisible(false); // Optionally hide after action
    };

    const style = {
        py: 0,
        width: '100%',
        maxWidth: 360,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#424242',
        color: 'white',
        zIndex: 1000,
        position: 'absolute',
        bottom: '64px',
        left: '49px',
        '& .MuiListItem-root': {
            padding: '8px 16px',
            borderBottom: '1px solid #616161',
            '&:last-child': {
                borderBottom: 'none',
            },
        },
        '& .MuiListItemText-primary': {
            fontSize: '0.875rem',
            fontWeight: 500,
        },
        '& .MuiListItem-root:hover': {
            backgroundColor: '#616161',
            cursor: 'pointer',
        },
        '& .MuiSvgIcon-root': {
            color: 'white',
        },
    };

    return (
        <>
            <List sx={style} className="send-file-type" data-testid="send-file-type" onMouseLeave={() => setIsSendFileTypeVisible(false)}>
                <ListItem
                    onClick={() => handleListItemClick(photoVideoInputRef)}
                    data-testid="photo-video-item">
                    <CropOriginalOutlinedIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Photo or video" />
                    <input
                        type="file"
                        accept="image/*,video/*"
                        ref={photoVideoInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            setFile(e.target.files?.[0] || null);
                            console.log('File selected:', e.target.files?.[0]);
                            setIsSendFileTypeVisible(false);
                            uploadFile(e.target.files?.[0] as File);
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleListItemClick(documentInputRef)}
                    data-testid="document-item"
                >
                    <InsertDriveFileOutlinedIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Document" />
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        ref={documentInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            setFile(e.target.files?.[0] || null);
                            console.log('File selected:', e.target.files?.[0]);
                            setIsSendFileTypeVisible(false);
                            uploadFile(e.target.files?.[0] as File);
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={handleLocationClick}
                    data-testid="location-item">
                    <PlaceOutlinedIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Location" />
                    {/* Optional: Keep file input if needed, otherwise remove */}
                    <input
                        type="file"
                        accept="text/plain"
                        ref={locationInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            setFile(e.target.files?.[0] || null);
                            console.log('File selected:', e.target.files?.[0]);
                            setIsSendFileTypeVisible(false);
                            uploadFile(e.target.files?.[0] as File);
                        }}
                    />
                </ListItem>
            </List>
        </>
    );
}

export default SendFileType;