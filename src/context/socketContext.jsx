import { createContext, useMemo } from "react";
import { io } from "socket.io-client";

export const socket_context = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io("http://localhost:3001"), []);

    return (
        <socket_context.Provider value={{ socket }}>
            {children}
        </socket_context.Provider>
    );
};
