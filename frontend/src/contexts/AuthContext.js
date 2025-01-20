import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Geliştirme aşaması için mock admin user
    const mockUser = {
        id: 1,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        role: 'admin',
        is_active: true
    };

    const value = {
        user: mockUser,
        loading: false,
        isAuthenticated: true
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 