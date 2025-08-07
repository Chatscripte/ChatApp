export interface ChatTemplateProps {
    isChatOpend: boolean;
    currentChat: { _id: string; title: string; profile: string } | null;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDrawerOpen: boolean;
}

export interface Message {
    _id: string;
    createdAt: string;
    sender: { _id: string; username: string };
    text: string;
    fileUrl?: string;
}


export interface ChatHeaderProps {
    currentChat: { _id: string, title: string, profile: string } | null;
    toggleDrawer: () => void;
}