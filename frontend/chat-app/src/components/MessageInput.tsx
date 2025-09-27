import { Box, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SendFileType from "./SendFileType";
import { SOCKET_EVENTS } from "../enums";
import socket from "../lib/socket";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useChatContext } from "../hooks/useChatContext";
import SendIcon from "@mui/icons-material/Send";
import type { Message } from "../types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import EmojiPickerComponent from "./EmojiPicker";
import { getChatInformation } from "../lib/helper";

function MessageInput({
                          currentChat,
                          setMessages,
                          messages,
                          messagesEndRef,
                      }: {
    currentChat: { _id: string } | null;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [message, setMessage] = useState("");
    const { setCurrentChatInfos , setLastMessage } = useChatContext();
    const attachIcon = useRef<SVGSVGElement | null>(null);
    const [isSendFileTypeVisible, setIsSendFileTypeVisible] = useState(false);
    const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    // Load messages fresh when chat changes
    useEffect(() => {
        if (!currentChat?._id) {
            setMessages([]);
            return;
        }

        // clear old messages immediately
        setMessages([]);

        const fetchMessages = async () => {
            const updatedChat = await getChatInformation(currentChat._id);
            setMessages(updatedChat?.messages || []);
            setLastMessage(updatedChat.messages[updatedChat.messages.length - 1])
            setCurrentChatInfos(updatedChat);
        };

        fetchMessages();
    }, [currentChat?._id, setMessages, setCurrentChatInfos]);

    // Socket listener for real-time incoming messages
    useEffect(() => {
        const handleMessage = (data: { data: { message: Message } }) => {
            if (data?.data?.message) {
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg._id === data.data.message._id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, data.data.message];
                });
            }
        };

        socket.on(SOCKET_EVENTS.CHAT_GET_MESSAGES, handleMessage);

        return () => {
            socket.off(SOCKET_EVENTS.CHAT_GET_MESSAGES, handleMessage);
        };
    }, [setMessages]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, messagesEndRef]);

    // Send message
    const sendMessage = useCallback(() => {
        if (!message || !currentChat?._id) return;

        socket.emit(
            SOCKET_EVENTS.CHAT_SEND_MESSAGE,
            {
                chatID: currentChat._id,
                text: message,
            },
            async () => {
                setMessage("");
            }
        );
    }, [message, currentChat?._id]);

    const handleMouseEnter = useCallback(() => {
        setIsSendFileTypeVisible(true);
    }, []);

    const handleShowEmoji = () => {
        setIsShowEmojiPicker((prev) => !prev);
    };

    return (
        <>
            <div className="emoji">
                {isShowEmojiPicker && (
                    <EmojiPickerComponent
                        setMessage={setMessage}
                        setIsShowEmojiPicker={setIsShowEmojiPicker}
                    />
                )}
            </div>
            <Box className="message-input">
                <div className="input-icons">
                    <AttachFileIcon
                        className="attach-icon"
                        onMouseOver={handleMouseEnter}
                        ref={attachIcon}
                    />
                    <SentimentSatisfiedAltIcon
                        className="smile-icon"
                        onMouseOver={handleShowEmoji}
                    />
                </div>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    className="input-field"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <SendIcon className="send-icon" onClick={sendMessage} />
                {isSendFileTypeVisible && (
                    <SendFileType
                        file={file}
                        setFile={setFile}
                        setIsSendFileTypeVisible={setIsSendFileTypeVisible}
                    />
                )}
            </Box>
        </>
    );
}

export default MessageInput;
