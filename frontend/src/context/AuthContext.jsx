import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = async (loginDetails) => {
       try {
        const { data } = await axios.post("/api/auth/login", loginDetails);
        setCurrentUser(data);
       } catch (error) {
          console.log(error)
          setCurrentUser(null);
          alert(error.response.data.message)
       }
    };

    const logout = async () => {
        await axios.post( "/api/auth/logout");
        setCurrentUser(null);
    };

    const updateUser = (user) => {
        setCurrentUser(user);
    };

    const checkAuth = async()=>{
        try {
         const {data} = await axios.get('/api/auth/checkAuth')
         setCurrentUser(data.user)
        } catch (error) {
         setCurrentUser(null)
        }
     }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateUser,checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

