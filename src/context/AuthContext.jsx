import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize session on mount
    useEffect(() => {
        console.log('🔐 Initializing auth session...')

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('Session error:', error)
                setLoading(false)
                setIsInitialized(true)
                return
            }

            if (session?.user) {
                console.log('✅ Session found:', session.user.email)
                loadUserProfile(session.user.id)
            } else {
                console.log('ℹ️ No active session')
                setLoading(false)
                setIsInitialized(true)
            }
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth event:', event)

            // Skip SIGNED_UP event (user will be logged out immediately)
            if (event === 'SIGNED_UP') {
                setLoading(false)
                return
            }

            // Handle SIGNED_IN
            if (event === 'SIGNED_IN' && session?.user) {
                console.log('✅ User signed in:', session.user.email)
                await loadUserProfile(session.user.id)
                return
            }

            // Handle SIGNED_OUT
            if (event === 'SIGNED_OUT') {
                console.log('👋 User signed out')
                setUser(null)
                setLoading(false)
                return
            }

            // Handle TOKEN_REFRESHED
            if (event === 'TOKEN_REFRESHED' && session?.user) {
                console.log('🔄 Token refreshed')
                // Don't reload profile, just update session
                setLoading(false)
                return
            }

            // Default: check if we have a session
            if (session?.user) {
                await loadUserProfile(session.user.id)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => {
            console.log('🧹 Cleaning up auth subscription')
            subscription.unsubscribe()
        }
    }, [])

    // Load user profile from database
    const loadUserProfile = async (userId) => {
        try {
            console.log('📝 Loading profile for:', userId)

            // Query with timeout
            const profilePromise = supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            const { data: profile, error } = await profilePromise

            console.log('📊 Profile query result:', {
                hasProfile: !!profile,
                hasError: !!error,
                errorMessage: error?.message,
                errorCode: error?.code
            })

            // Get email from auth
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

            if (authError) {
                console.error('❌ Auth user error:', authError)
            }

            console.log('👤 Auth user:', authUser?.email)

            if (!authUser) {
                console.warn('⚠️ No auth user found')
                setUser(null)
                setLoading(false)
                setIsInitialized(true)
                return
            }

            // If profile not found, use auth data only
            if (error || !profile) {
                console.warn('⚠️ Profile not found, using auth data only:', error?.message || 'No profile data')
                const fallbackUser = {
                    id: userId,
                    email: authUser.email,
                    name: authUser.user_metadata?.full_name || authUser.email,
                    phone: null,
                    avatar: null,
                    role: 'user',
                    loyaltyPoints: 0,
                    rewardPoints: 0
                }
                console.log('🔄 Setting fallback user:', fallbackUser)
                setUser(fallbackUser)
                setLoading(false)
                setIsInitialized(true)
                return
            }

            // Profile found, use full data
            const fullUser = {
                id: profile.id,
                email: authUser.email,
                name: profile.full_name,
                phone: profile.phone,
                avatar: profile.avatar_url,
                role: profile.role,
                loyaltyPoints: profile.loyalty_points,
                rewardPoints: profile.reward_points
            }
            console.log('✅ Profile loaded successfully:', fullUser.role)
            setUser(fullUser)
            setLoading(false)
            setIsInitialized(true)
        } catch (error) {
            console.error('❌ CRITICAL Error loading profile:', error)
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            })

            // Fallback to auth data
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser()
                if (authUser) {
                    const fallbackUser = {
                        id: authUser.id,
                        email: authUser.email,
                        name: authUser.user_metadata?.full_name || authUser.email,
                        phone: null,
                        avatar: null,
                        role: 'user',
                        loyaltyPoints: 0,
                        rewardPoints: 0
                    }
                    console.log('🔄 Fallback user set after error:', fallbackUser)
                    setUser(fallbackUser)
                } else {
                    console.error('❌ No auth user in fallback')
                    setUser(null)
                }
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError)
                setUser(null)
            }

            setLoading(false)
            setIsInitialized(true)
        }
    }

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login:', email)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            console.log('✅ Login successful')
            await loadUserProfile(data.user.id)
            return { success: true, user: data.user }
        } catch (error) {
            console.error('❌ Login error:', error)
            return { success: false, error: error.message }
        }
    }

    const register = async (userData) => {
        try {
            console.log('📝 Registering user:', userData.email)

            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName
                    }
                }
            })

            if (signUpError) throw signUpError

            if (!authData.user) {
                throw new Error('Không thể tạo tài khoản')
            }

            console.log('✅ Auth user created')

            // Create profile in database
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    full_name: userData.fullName,
                    phone: userData.phone || null,
                    role: 'user'
                })

            if (profileError && profileError.code !== '23505') {
                console.error('⚠️ Profile creation error:', profileError)
                throw profileError
            }

            // Logout immediately (user must login manually)
            await supabase.auth.signOut()
            console.log('✅ Registration complete, user logged out')

            return { success: true, user: authData.user }
        } catch (error) {
            console.error('❌ Registration error:', error)
            return { success: false, error: error.message }
        }
    }

    const logout = async () => {
        try {
            console.log('👋 Logging out...')

            // IMPORTANT: Collect keys BEFORE calling signOut
            // because signOut might clear them
            const keysToRemove = []
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                    keysToRemove.push(key)
                }
            }

            console.log('🔍 Found keys to remove:', keysToRemove)

            // Clear user state first
            setUser(null)

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('⚠️ Supabase signOut error:', error)
            }

            // Manually remove all collected keys
            keysToRemove.forEach(key => {
                localStorage.removeItem(key)
                console.log('🧹 Cleared:', key)
            })

            // Double-check: Force clear known Supabase keys
            const projectRef = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0]
            if (projectRef) {
                const knownKeys = [
                    `sb-${projectRef}-auth-token`,
                    `sb-${projectRef}-auth-token-code-verifier`
                ]
                knownKeys.forEach(key => {
                    if (localStorage.getItem(key)) {
                        localStorage.removeItem(key)
                        console.log('🧹 Force cleared:', key)
                    }
                })
            }

            console.log('✅ Logout complete, cleared', keysToRemove.length, 'keys')
        } catch (error) {
            console.error('❌ Logout error:', error)
        }
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
        isInitialized,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
