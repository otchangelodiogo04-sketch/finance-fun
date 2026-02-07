import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserProfile = "crianca" | "jovem" | "pais";

export interface User {
  id: string;
  email: string;
  username: string;
  age: number;
  profile: UserProfile;
  points: number;
  rank: "D" | "C" | "B" | "A" | "S";
  lessonsCompleted: number;
  avatar?: string;
  fullName?: string;
  address?: string;
  hobbies?: string;
  interests?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  addPoints: (points: number) => void;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  age: number;
  profile: UserProfile;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (data) {
        return {
          id: data.user_id,
          email: data.email,
          username: data.username,
          age: data.age || 0,
          profile: data.profile_type as UserProfile,
          points: data.points,
          rank: data.rank as "D" | "C" | "B" | "A" | "S",
          lessonsCompleted: data.lessons_completed,
          avatar: data.avatar_url || undefined,
          fullName: data.full_name || undefined,
          address: data.address || undefined,
          hobbies: data.hobbies || undefined,
          interests: data.interests || undefined,
          createdAt: data.created_at,
        };
      }
      return null;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      const profile = await fetchProfile(session.user.id);
      if (profile) {
        setUser(profile);
      }
    }
  };

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (newSession?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(async () => {
            const profile = await fetchProfile(newSession.user.id);
            setUser(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        const profile = await fetchProfile(existingSession.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        if (profile) {
          setUser(profile);
        }
        return { success: true };
      }

      return { success: false, error: "Não foi possível fazer login" };
    } catch (err) {
      console.error("Login exception:", err);
      return { success: false, error: "Erro inesperado" };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            username: data.username,
            age: data.age,
            profile_type: data.profile,
          },
        },
      });

      if (error) {
        console.error("Register error:", error);
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Update the profile with additional data
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            username: data.username,
            age: data.age,
            profile_type: data.profile,
          })
          .eq("user_id", authData.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
        }

        // Check if email confirmation is required
        if (authData.session) {
          const profile = await fetchProfile(authData.user.id);
          if (profile) {
            setUser(profile);
          }
          return { success: true };
        } else {
          // Email confirmation required
          return { success: true, error: "Verifique o seu email para confirmar a conta" };
        }
      }

      return { success: false, error: "Não foi possível criar a conta" };
    } catch (err) {
      console.error("Register exception:", err);
      return { success: false, error: "Erro inesperado" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUser = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);

      // Update in database
      const updatePayload: Record<string, unknown> = {};
      if (data.username !== undefined) updatePayload.username = data.username;
      if (data.age !== undefined) updatePayload.age = data.age;
      if (data.profile !== undefined) updatePayload.profile_type = data.profile;
      if (data.avatar !== undefined) updatePayload.avatar_url = data.avatar;
      if (data.fullName !== undefined) updatePayload.full_name = data.fullName;
      if (data.address !== undefined) updatePayload.address = data.address;
      if (data.hobbies !== undefined) updatePayload.hobbies = data.hobbies;
      if (data.interests !== undefined) updatePayload.interests = data.interests;
      if (data.lessonsCompleted !== undefined) updatePayload.lessons_completed = data.lessonsCompleted;

      if (Object.keys(updatePayload).length === 0) return;

      const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const addPoints = async (points: number) => {
    if (user) {
      const newPoints = user.points + points;
      let newRank = user.rank;

      // Calculate new rank
      if (newPoints >= 10000) newRank = "S";
      else if (newPoints >= 5000) newRank = "A";
      else if (newPoints >= 2000) newRank = "B";
      else if (newPoints >= 500) newRank = "C";

      // Update locally first for immediate feedback
      setUser({ ...user, points: newPoints, rank: newRank });

      // Update in database
      const { error } = await supabase
        .from("profiles")
        .update({
          points: newPoints,
          rank: newRank,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating points:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        addPoints,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
