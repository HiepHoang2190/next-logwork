"use client";

import Cookies from "js-cookie";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { fetchWithCredentials } from "./fetchApi";

const initAuthContextPropsState = {
    currentUser: undefined,
    setCurrentUser: () => {},
    setCompanyName: () => {},
    refreshToken: (token) => {},
    getUser: () => {},
    logout: () => {},
};

const AuthContext = createContext(initAuthContextPropsState);

const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();

    const token = Cookies.get("JSESSIONID");

    const logout = () => {
        setCurrentUser(undefined);
        Cookies.remove("JSESSIONID");
        window.location.href = "/login";
    };

    function handleLogout() {
        logout();
        return;
    }
    
    const headers = {
        Cookie: `JSESSIONID=${token}`,
    };

    const refreshToken = async (token) => {
        if (!token) return handleLogout();

        try {
            const data = await fetchWithCredentials(
                `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/auth/1/session`,
                {
                    method: "GET",
                    headers,
                }
            );
            if (!data) return handleLogout();
            const dataUser = await fetchWithCredentials(
                `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/user?username=${data.name}`,
                {
                    method: "GET",
                    headers,
                }
            );
            setCurrentUser(dataUser);
        } catch (error) {
            return handleLogout();
        }
    };


    const getUser = async () => {
        try {
            const dataUser = await fetchWithCredentials(
                `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/auth/1/session`,
                {
                    method: "GET",
                    headers,
                }
            );
            if (!dataUser) return handleLogout();

            const dataRes = await fetchWithCredentials(
                `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/user?username=${dataUser.name}`,
                {
                    method: "GET",
                    headers,
                }
            );
            if (!dataRes) return handleLogout();
            setCurrentUser(dataRes);
        } catch (error) {
            console.error(error);
            logout();
        }
    };

    useEffect(() => {
        if (token) {
            refreshToken(token);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                refreshToken,
                getUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };
