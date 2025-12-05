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
    chatInfo: { [chatId: string]: chatInfo | null };
    setChatInfo: React.Dispatch<React.SetStateAction<{ [chatId: string]: chatInfo | null }>>;
    isCreatedGroup: boolean;
    setIsCreatedGroup: React.Dispatch<React.SetStateAction<boolean>>;
    isSearchingChats: boolean;
    setIsSearchingChats: React.Dispatch<React.SetStateAction<boolean>>;
    isChatOpend: boolean;
    setIsChatOpend: React.Dispatch<React.SetStateAction<boolean>>;
    currentChat: { _id: string; title: string; profile: string } | null;
    setCurrentChat: React.Dispatch<React.SetStateAction<{ _id: string; title: string; profile: string } | null>>;
    allChats: Array<{ _id: string; title: string; profile: string; type?: string }>;
    setAllChats: React.Dispatch<React.SetStateAction<Array<{ _id: string; title: string; profile: string; type?: string }>>>;
    isCreatedPv: boolean;
    setIsCreatedPv: React.Dispatch<React.SetStateAction<boolean>>;
    currentChatInfos: chatInfo | null;
    setCurrentChatInfos: React.Dispatch<React.SetStateAction<chatInfo | null>>;
    lastMessage: {}
    setLastMessage : React.Dispatch<React.SetStateAction<{} | null>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatInfo, setChatInfo] = useState<{ [chatId: string]: chatInfo | null }>({});
    const [isCreatedGroup, setIsCreatedGroup] = useState<boolean>(false);
    const [isSearchingChats, setIsSearchingChats] = useState<boolean>(false);
    const [isChatOpend, setIsChatOpend] = useState<boolean>(false);
    const [isCreatedPv, setIsCreatedPv] = useState<boolean>(false);
    const [allChats, setAllChats] = useState<Array<{ _id: string; title: string; profile: string; type?: string }>>([]);
    const [currentChat, setCurrentChat] = useState<{ _id: string; title: string; profile: string } | null>(null);
    const [currentChatInfos, setCurrentChatInfos] = useState<chatInfo | null>(null);
    const [lastMessage , setLastMessage] = useState({})

    return (
        <ChatContext.Provider value={{ isCreatedPv, lastMessage , setLastMessage ,setIsCreatedPv, allChats, setAllChats, isChatOpend, setIsChatOpend, currentChat, setCurrentChat, chatInfo, setChatInfo, isCreatedGroup, setIsCreatedGroup, isSearchingChats, setIsSearchingChats, currentChatInfos, setCurrentChatInfos  }}>
            {children}
        </ChatContext.Provider>
    );
};
