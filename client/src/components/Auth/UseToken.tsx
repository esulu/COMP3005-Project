import { useState } from "react";

/**
 * Allows retrieval, setting, and deletion of the session token
 * Stores tokens into local storage
 */
export const UseToken = () => {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString || '{}');
        return userToken?.token;
    }

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: any) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    }

    const deleteToken = () => {
        localStorage.removeItem('token');
    }

    return {
        setToken: saveToken,
        token,
        removeToken: deleteToken
    }
}