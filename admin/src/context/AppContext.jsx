
/* eslint-disable react-refresh/only-export-components */
import React, { createContext } from "react";
export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const calulateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return 'N/A';
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    const value = {
        // Add your context data here
        calulateAge,
        calculateAge: calulateAge  // Correctly spelled alias
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;