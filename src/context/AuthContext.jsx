import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error('Failed to parse stored user:', error)
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [])

    const login = (email, password) => {
        // Mock authentication - replace with real API call
        // Admin credentials: admin@cinebook.vn / admin123
        // Regular user: user@cinebook.vn / user123

        if (email === 'admin@cinebook.vn' && password === 'admin123') {
            const adminUser = {
                id: 1,
                email: 'admin@cinebook.vn',
                name: 'Quản Trị Viên',
                role: 'admin',
                avatar: null,
            }
            setUser(adminUser)
            localStorage.setItem('user', JSON.stringify(adminUser))
            return { success: true, user: adminUser }
        } else if (email === 'user@cinebook.vn' && password === 'user123') {
            const regularUser = {
                id: 2,
                email: 'user@cinebook.vn',
                name: 'Nguyễn Văn A',
                role: 'user',
                avatar: null,
            }
            setUser(regularUser)
            localStorage.setItem('user', JSON.stringify(regularUser))
            return { success: true, user: regularUser }
        } else {
            return { success: false, error: 'Email hoặc mật khẩu không đúng' }
        }
    }

    const register = (userData) => {
        // Mock registration - replace with real API call
        const newUser = {
            id: Date.now(),
            email: userData.email,
            name: userData.fullName,
            role: 'user',
            avatar: null,
        }
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        return { success: true, user: newUser }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    const isAdmin = () => {
        return user?.role === 'admin'
    }

    const isAuthenticated = () => {
        return !!user
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
