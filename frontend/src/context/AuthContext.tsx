import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../mockData';

interface AuthContextType {
    user: User | null;
    role: 'buyer' | 'seller' | null;
    isLoading: boolean;
    login: (email: string, pass: string) => { success: boolean, message: string };
    register: (name: string, email: string, pass: string, role: 'buyer' | 'seller') => { success: boolean, message: string };
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'buyer' | 'seller' | null>(null);
    const [isLoading, setIsLoading] = useState(true); // stays true until localStorage is read

    const [usersDb, setUsersDb] = useState<User[]>([]);

    useEffect(() => {
        const storedUsers = localStorage.getItem('mockUsersDb');
        if (storedUsers) {
            setUsersDb(JSON.parse(storedUsers));
        } else {
            const defaultSeller: User = {
                id: '1',
                name: 'Demo Seller',
                email: 'seller@demo.com',
                password: 'password123',
                role: 'seller',
            };
            setUsersDb([defaultSeller]);
            localStorage.setItem('mockUsersDb', JSON.stringify([defaultSeller]));
        }

        const activeUser = localStorage.getItem('activeUser');
        if (activeUser) {
            const parsed = JSON.parse(activeUser);
            setUser(parsed);
            setRole(parsed.role);
        }

        setIsLoading(false); // unblock route guards AFTER auth state is restored
    }, []);

    const login = (email: string, pass: string) => {
        const foundUser = usersDb.find(u => u.email === email && u.password === pass);
        if (foundUser) {
            setUser(foundUser);
            setRole(foundUser.role);
            localStorage.setItem('activeUser', JSON.stringify(foundUser));
            return { success: true, message: 'Logged in successfully.' };
        }
        return { success: false, message: 'Invalid email or password.' };
    };

    const register = (name: string, email: string, pass: string, registerRole: 'buyer' | 'seller') => {
        if (usersDb.some(u => u.email === email)) {
            return { success: false, message: 'Email already exists.' };
        }
        const newUser: User = { id: Date.now().toString(), name, email, password: pass, role: registerRole };
        const updatedDb = [...usersDb, newUser];
        setUsersDb(updatedDb);
        localStorage.setItem('mockUsersDb', JSON.stringify(updatedDb));
        setUser(newUser);
        setRole(newUser.role);
        localStorage.setItem('activeUser', JSON.stringify(newUser));
        return { success: true, message: 'Account created successfully.' };
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('activeUser');
    };

    return (
        <AuthContext.Provider value={{ user, role, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
