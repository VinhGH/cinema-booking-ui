import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadUserProfile = async (authUser) => {
    try {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profile) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email,
          phone: null,
          avatar: null,
          role: "user",
          loyaltyPoints: 0,
          rewardPoints: 0,
        });
        return;
      }

      setUser({
        id: profile.id,
        email: authUser.email,
        name: profile.full_name,
        phone: profile.phone,
        avatar: profile.avatar_url,
        role: profile.role,
        loyaltyPoints: profile.loyalty_points,
        rewardPoints: profile.reward_points,
      });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          loadUserProfile(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
        setIsInitialized(true);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        loadUserProfile(data.session.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
      setIsInitialized(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setSession(data.session);
      await loadUserProfile(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: { data: { full_name: userData.fullName } },
      });
      if (error) throw error;

      await supabase.from("users").insert({
        id: data.user.id,
        full_name: userData.fullName,
        phone: userData.phone || null,
        role: "user",
      });

      await supabase.auth.signOut();

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) localStorage.removeItem(key);
      });

      setUser(null);
      setSession(null);
    } catch {
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
