import { createContext, useState } from "react";

interface chatInfo {
    owner: { id: string, username: string, createdAt: Date, updatedAt: Date },
    profile: string,
    title: string,
    type: string,
    inviteLink: string
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

interface chatMember {
    role: string,
    user: {
        _id: string,
        username: string,
        createdAt: Date,
        updatedAt: Date
    }
}

export interface ChatContextType {
    chatInfo: chatInfo | null;
    setChatInfo: React.Dispatch<React.SetStateAction<chatInfo | null>>;
    chatMembers: chatMember[];
    setChatMembers: React.Dispatch<React.SetStateAction<chatMember[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatInfo, setChatInfo] = useState<chatInfo | null>(null);
    const [chatMembers, setChatMembers] = useState<chatMember[]>([]);

    return (
        <ChatContext.Provider value={{ chatInfo, setChatInfo, chatMembers, setChatMembers }}>
            {children}
        </ChatContext.Provider>
    );
};


