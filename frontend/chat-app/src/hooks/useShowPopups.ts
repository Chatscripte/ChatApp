import { useContext } from "react";
import { ShowPopupsContext } from "../Contexts/ShowPopupsContext";
export const useShowPopups = () => {
    const context = useContext(ShowPopupsContext);
    if (!context) {
        throw new Error("useShowPopups must be used within a ShowPopupsContextProvider");
    }
    return context;
};