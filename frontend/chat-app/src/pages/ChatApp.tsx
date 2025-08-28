import { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import '../styles/ChatApp.scss';
import socket, { updateSocketAuth } from '../lib/socket';
import { useAuth } from '../hooks/useAuth';
import { getCookie, refreshAccessToken } from '../lib/helper';
import { ToastContainer } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import ChatTemplate from '../components/ChatTemplate';
import SidebarDrawer from '../components/SidebarDrawer';

function ChatApp() {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const { accessToken, setAccessToken } = useAuth();
    const accessTokenExpiresInSeconds = import.meta.env.VITE_ACCESS_TOKEN_EXPIRES_IN_SECONDS;

    // Refresh access token
    useEffect(() => {
        setTimeout(() => {
            refreshAccessToken();
            console.log('access token refreshed');
        }, accessTokenExpiresInSeconds);
    }, [accessToken]);

    // Connect to WebSocket
    useEffect(() => {
        const token = getCookie('accessToken');
        if (token) {
            setAccessToken(token);
        }
        if (accessToken) {
            updateSocketAuth(accessToken);
            socket.connect();
            socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });
            socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server');
            });
            socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });
            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('connect_error');
                socket.disconnect();
            };
        }
    }, [accessToken]);

    return (
        <Box className="chat-system">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
            <Grid container className="chat-container">
                {/* Sidebar: Conversation List (Desktop) */}
                <Sidebar  />
                {/* Mobile Sidebar (Drawer) */}
                <SidebarDrawer
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
                />
                {/* Main Chat Area */}
                <ChatTemplate
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen} />
            </Grid>
        </Box >
    );
}

export default ChatApp;