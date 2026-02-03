import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addPoints: (points: number) => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  age: number;
  profile: UserProfile;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "demo@finance.app": {
    password: "demo123",
    user: {
      id: "1",
      email: "demo@finance.app",
      username: "DemoUser",
      age: 25,
      profile: "jovem",
      points: 1500,
      rank: "B",
      lessonsCompleted: 12,
      createdAt: new Date().toISOString(),
    },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("finance_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const demoUser = DEMO_USERS[email];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      localStorage.setItem("finance_user", JSON.stringify(demoUser.user));
      return true;
    }

    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem("finance_registered_users") || "{}");
    const registeredUser = registeredUsers[email];
    if (registeredUser && registeredUser.password === password) {
      setUser(registeredUser.user);
      localStorage.setItem("finance_user", JSON.stringify(registeredUser.user));
      return true;
    }

    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      username: data.username,
      age: data.age,
      profile: data.profile,
      points: 0,
      rank: "D",
      lessonsCompleted: 0,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("finance_registered_users") || "{}");
    registeredUsers[data.email] = { password: data.password, user: newUser };
    localStorage.setItem("finance_registered_users", JSON.stringify(registeredUsers));

    setUser(newUser);
    localStorage.setItem("finance_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("finance_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("finance_user", JSON.stringify(updatedUser));

      // Update in registered users
      const registeredUsers = JSON.parse(localStorage.getItem("finance_registered_users") || "{}");
      if (registeredUsers[user.email]) {
        registeredUsers[user.email].user = updatedUser;
        localStorage.setItem("finance_registered_users", JSON.stringify(registeredUsers));
      }
    }
  };

  const addPoints = (points: number) => {
    if (user) {
      const newPoints = user.points + points;
      let newRank = user.rank;

      // Calculate new rank
      if (newPoints >= 10000) newRank = "S";
      else if (newPoints >= 5000) newRank = "A";
      else if (newPoints >= 2000) newRank = "B";
      else if (newPoints >= 500) newRank = "C";

      updateUser({ points: newPoints, rank: newRank });
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
