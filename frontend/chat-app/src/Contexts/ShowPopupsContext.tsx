import { createContext, useState } from "react";

interface ShowPopupsContextType {
    isShowLocationPopup: boolean;
    setIsShowLocationPopup: (value: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ShowPopupsContext = createContext<ShowPopupsContextType | undefined>(undefined);

export const ShowPopupsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isShowLocationPopup, setIsShowLocationPopup] = useState<boolean>(false);
    return (
        <ShowPopupsContext.Provider value={{ isShowLocationPopup, setIsShowLocationPopup }}>
            {children}
        </ShowPopupsContext.Provider>
    );
}

