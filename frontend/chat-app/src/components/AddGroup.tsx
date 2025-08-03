import { useCallback, useEffect, useState } from 'react'
import '../styles/AddGroup.scss'
import { Box, CircularProgress } from '@mui/material'
import socket from '../lib/socket'
import { SOCKET_EVENTS } from '../enums';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useChatContext } from '../hooks/useChatContext';

interface AddGroupProps {
  setIsWantCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddGroup({ setIsWantCreateGroup }: AddGroupProps) {

  const [groupTitle, setGroupTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {  setChatInfo, setChatMembers } = useChatContext();

  // Handle group creation
  const createChat = useCallback(() => {
    if (!groupTitle.trim()) {
      setError('Group title cannot be empty');
      return;
    }

    if (!socket.connected) {
      setError('Not connected to the server. Please try again.');
      socket.connect();
      return;
    }

    setIsLoading(true);
    setError(null);

    // Store toastId to prevent unmount issues
    const toastId = toast.loading("Creating group...", {
      position: "top-right"
    });

    socket.emit(
      SOCKET_EVENTS.CHAT_CREATE,
      { type: 'group', title: groupTitle.trim() },
      (response: { success: boolean; message?: string; data?: unknown }) => {
        console.log('SOCKET_EVENTS.CHAT_CREATE response:', response);
        setIsLoading(false);
        if (response.success) {
          toast.update(toastId, {
            render: "Group created successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000
          });
          setGroupTitle('');
          // Delay closing the form to ensure toast shows
          setTimeout(() => setIsWantCreateGroup(false), 1000);
          socket.on(SOCKET_EVENTS.CHAT_CREATED, (data) => {
            console.log(data);
          })
        } else {
          toast.update(toastId, {
            render: response.message || 'Failed to create group',
            type: "error",
            isLoading: false,
            autoClose: 5000
          });
        }
      }
    );
  }, [groupTitle, setIsWantCreateGroup]);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CHAT_CREATED, (data) => {
      console.log(data);
      setChatInfo(data.chat.chatInfo);
      setChatMembers(data.chat.members);
    })
  }, [groupTitle])

  return (
    <>
      <Box className="add-new-group">
        <input
          type="text"
          className="group-title"
          value={groupTitle}
          onChange={(e) => setGroupTitle(e.target.value)}
          placeholder="Enter group title"
          aria-label="Group title"
          disabled={isLoading}
        />
        {error && <Box className="error-message" role="alert" sx={{ color: 'red', mb: 2 }}>{error}</Box>}
        <div className="btns">
          <button
            type="button"
            onClick={createChat}
            disabled={isLoading}
            aria-label="Create new group"
          >
            {isLoading ? <CircularProgress size={20} /> : 'Create Group'}
          </button>
          <button
            type="button"
            onClick={() => setIsWantCreateGroup(false)}
            disabled={isLoading}
            aria-label="Cancel group creation"
          >
            Cancel
          </button>
        </div>
      </Box>
    </>
  )
}

export default AddGroup
