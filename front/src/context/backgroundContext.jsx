
import { createContext, useState } from 'react';

export const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
    const [background, setBackground] = useState('');

    return (
        <BackgroundContext.Provider value={{ background, setBackground }}>
            {children}
        </BackgroundContext.Provider>
    );
};