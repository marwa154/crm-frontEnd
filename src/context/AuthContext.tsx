import { createContext, useState, useEffect, ReactNode } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isRestoring: boolean; 
  login: (userData: User, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setIsRestoring(false); 
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isRestoring) {
    return <div>Loading session...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isRestoring, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
