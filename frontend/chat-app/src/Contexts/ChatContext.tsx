import { createContext, useState } from "react";

interface chatInfo {
    chatInfo: {
        _id: string;
        createdAt: string;
        inviteLink: string;
        owner: { _id: string, password: string, username: string };
        title: string;
        type: string;
    },
    members: Array<{
        role: string;
        user: {
            _id: string;
            username: string;
            createdAt: string;
            updatedAt: string;
        }
    }>,
    messages: Array<{
        _id: string;
        text: string;
        createdAt: string;
        updatedAt: string;
        sender: {
            _id: string;
            username: string;
            createdAt: string;
            updatedAt: string;
        };
        fileUrl?: string;
        location?: {
            lat: number;
            long: number;
            _id: string;
        }
    }>
}
export interface ChatContextType {
    chatInfo: chatInfo | null;
    setChatInfo: React.Dispatch<React.SetStateAction<chatInfo | null>>;
    isCreatedGroup: boolean;
    setIsCreatedGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatInfo, setChatInfo] = useState<chatInfo | null>(null);
    const [isCreatedGroup, setIsCreatedGroup] = useState<boolean>(false);
    return (
        <ChatContext.Provider value={{ chatInfo, setChatInfo, isCreatedGroup, setIsCreatedGroup }}>
            {children}
        </ChatContext.Provider>
    );
};


