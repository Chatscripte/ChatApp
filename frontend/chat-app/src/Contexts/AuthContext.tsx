// AuthContext.tsx
import { createContext, useState } from "react";
import { getCookie } from "../lib/helper";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const accessTokenFromCookie = getCookie("accessToken");
    const [accessToken, setAccessToken] = useState<string | null>(accessTokenFromCookie ?? null);
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
