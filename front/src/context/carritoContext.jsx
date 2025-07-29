import { createContext, useState, useEffect } from 'react';

// Mantiene al carrito como un estado global

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    });

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    return (
        <CarritoContext.Provider value={{ carrito, setCarrito }}>
            {children}
        </CarritoContext.Provider>
    );
};
