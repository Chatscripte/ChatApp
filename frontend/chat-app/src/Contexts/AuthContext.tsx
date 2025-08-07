// AuthContext.tsx
import { createContext, useState } from "react";
import { getCookie } from "../lib/helper";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    currentUser?: { userID: string; iat: number , exp: number } | null;
    setCurrentUser?: (user: { userID: string; iat: number , exp: number } | null) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const accessTokenFromCookie = getCookie("accessToken");
    const [accessToken, setAccessToken] = useState<string | null>(accessTokenFromCookie ?? null);
    const [currentUser, setCurrentUser] = useState<{ userID: string; iat: number , exp: number } | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
