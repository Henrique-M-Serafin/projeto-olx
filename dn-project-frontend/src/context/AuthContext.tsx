"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, login, logout, register } from "@/services/services";
import { LoginData, RegisterData, User } from "@/types";
import { useRouter } from "next/dist/client/components/navigation";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    handleLogin: (data: LoginData) => Promise<void>;
    handleRegister: (data: RegisterData) => Promise<void>;
    handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        getMe()
            .then(setUser)
            .catch((error) => {
                if (error?.response?.status !== 401) {
                    console.error('Error fetching user:', error);
                }
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleLogin = async (data: LoginData) => {
        await login(data.email, data.password);
        const me = await getMe();
        setUser(me);
    };

    const handleRegister = async (data: RegisterData) => {
        await register(data);
        await handleLogin({ email: data.email, password: data.password });
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                handleLogin,
                handleRegister,
                handleLogout,
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};