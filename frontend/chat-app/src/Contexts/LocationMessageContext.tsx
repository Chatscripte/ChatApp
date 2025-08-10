import { createContext, useState } from "react";

interface LocationMessageContextType {
    coordinates: { lat: number, long: number }
    setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number, long: number }>>
}

export const LocationMessageContext = createContext<LocationMessageContextType | undefined>(undefined);

export const LocationMessageContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number, long: number }>({ lat: 0, long: 0 });
    return (
        <LocationMessageContext.Provider value={{ coordinates, setCoordinates  }}>
            {children}
        </LocationMessageContext.Provider>
    )
}

