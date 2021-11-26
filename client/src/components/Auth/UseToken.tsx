import { useState } from "react";

/**
 * Allows retrieval, setting, and deletion of the session token
 * Stores tokens into local storage
 * At the same time also stores if the token belongs to an owner of the site
 */
export const UseToken = () => {
    
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString || '{}');
        return userToken?.token;
    }

    const getIsTokenOwner = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString || '{}');
        return userToken?.is_owner;
    }

    const [token, setToken] = useState(getToken());
    const [isTokenOwner, setIsTokenOwner] = useState(getIsTokenOwner());

    const saveToken = (userToken: any) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        setIsTokenOwner(userToken.is_owner || false);
    }


    const deleteToken = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isOwner');
    }

    return {
        setToken: saveToken,
        token,
        isTokenOwner,
        removeToken: deleteToken
    }
}