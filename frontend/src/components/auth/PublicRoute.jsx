import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PublicRoute({ children }) {
    const { user, loading, isInitialized } = useAuth()

    // Wait for auth to initialize
    if (!isInitialized || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-foreground">Đang tải...</p>
                </div>
            </div>
        )
    }

    // Already logged in - redirect to home
    if (user) {
        return <Navigate to="/" replace />
    }

    // Not logged in - show login/register page
    return children
}
