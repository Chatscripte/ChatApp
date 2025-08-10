import { useContext } from 'react';
import { LocationMessageContext } from '../Contexts/LocationMessageContext';

const useLocation = () => {
    const context = useContext(LocationMessageContext);
    if (!context) throw new Error("useLocation must be used within a LocationMessageContextProvider");
    return context;
};

export default useLocation;