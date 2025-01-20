import { createContext } from "react";
import { useState } from "react";

export const user_eamil_context = createContext('')

export const UserEmailContextProvider = ({children}) =>{
    const [myEmail, setEmail] = useState('')
    return (
        <user_eamil_context.Provider value={{myEmail, setEmail}}>
            {children}
        </user_eamil_context.Provider>
    )
}

