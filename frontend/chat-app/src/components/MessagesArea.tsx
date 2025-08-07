import { Box, Paper, Typography } from '@mui/material'
import type { Message } from '../types';
import { Link } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import '../styles/MessageArea.scss'

interface ChatTemplateProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    currentUser: { userID: string; iat: number; exp: number } | null | undefined;
}

function MessagesArea({ messages, messagesEndRef, currentUser }: ChatTemplateProps) {
    const acceptedFiles = (msg: Message) => {
        return msg.fileUrl && (msg.fileUrl.endsWith('.jpg') || msg.fileUrl.endsWith('.png') || msg.fileUrl.endsWith('.jpeg') || msg.fileUrl.endsWith('.gif') || msg.fileUrl.endsWith('.mp4'));
    }
    return (
        <Box className="messages" sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {messages.map((msg) => (
                <Box
                    key={msg._id}
                    className={`message ${msg.sender._id === currentUser?.userID ? 'sent' : 'received'}`}>
                    <Typography variant="body2" className="message-sender">
                        {msg.sender.username}
                    </Typography>
                    <Paper className="message-bubble">
                        <Typography variant="body1">{msg.text}</Typography>
                        {msg.fileUrl && (
                            <Box className="message-file">
                                <Link to={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                    {acceptedFiles(msg) ? (
                                        msg.fileUrl.endsWith('.mp4') ? (
                                            <video controls style={{ maxWidth: '100%', maxHeight: '100%', width: '300px', height: 'auto' }} className="message-video">
                                                <source src={msg.fileUrl} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img src={msg.fileUrl} style={{ maxWidth: '100%', maxHeight: '100%', width: '300px', height: 'auto' }} alt="Attached file" className="message-image" />
                                        )
                                    ) : (
                                        <Box className="message-file-info">
                                            <Box className={'message-file'}>
                                                <div className='file-icon'>
                                                    <InsertDriveFileIcon />
                                                </div>
                                                <div>
                                                    <Typography variant="body2" className="message-file-name">
                                                        {`${msg.fileUrl.substring(msg.fileUrl.lastIndexOf('/') + 1)}`}
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
                        )}
                        <Typography variant="caption" className="message-time">
                            {msg.createdAt.substring(11, 16)}
                        </Typography>
                    </Paper>
                </Box>
            ))}
            <div ref={messagesEndRef} />
        </Box>
    )
}

export default MessagesArea
