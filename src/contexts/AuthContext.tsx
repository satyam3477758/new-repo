
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserOrders: () => Promise<any[]>;
  createOrder: (items: { productId: number; quantity: number; price: number }[]) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    
    // Get initial session from localStorage
    const savedSession = localStorage.getItem('agroconnect_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession) as Session;
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (e) {
        console.error("Failed to parse saved session", e);
        localStorage.removeItem('agroconnect_session');
      }
    }
    
    setIsLoading(false);
  }, []);

  const createMockSession = (email: string): Session => {
    const mockUser = {
      id: `usr_${Date.now()}`,
      email,
      app_metadata: { provider: 'email' },
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    return {
      access_token: `mock_jwt_token_${Math.random().toString(36).substr(2)}`,
      refresh_token: `mock_refresh_token`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser,
    };
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const session = createMockSession(email);
      localStorage.setItem('agroconnect_session', JSON.stringify(session));
      setSession(session);
      setUser(session.user);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to AgroConnect! You have been logged in automatically.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const session = createMockSession(email);
      localStorage.setItem('agroconnect_session', JSON.stringify(session));
      setSession(session);
      setUser(session.user);
      
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.removeItem('agroconnect_session');
      setSession(null);
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Function to get user's orders (mocked)
  const getUserOrders = async () => {
    if (!user) return [];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Attempt to load mock orders from localStorage
    const savedOrders = localStorage.getItem('agroconnect_orders');
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
    
    return [];
  };

  // Function to create a new order (mocked)
  const createOrder = async (items: { productId: number; quantity: number; price: number }[]) => {
    if (!user) return null;
    
    try {
      // Simulate order creation
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newOrder = {
        id: orderId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: items.map((item, index) => ({
          id: `item_${Date.now()}_${index}`,
          product_id: item.productId,
          quantity: item.quantity,
          price_at_purchase: item.price,
          created_at: new Date().toISOString(),
        }))
      };

      // Save to localStorage
      const existingOrdersStr = localStorage.getItem('agroconnect_orders');
      let existingOrders = [];
      if (existingOrdersStr) {
        try {
          existingOrders = JSON.parse(existingOrdersStr);
        } catch(e) {}
      }
      
      existingOrders.unshift(newOrder); // Add to beginning
      localStorage.setItem('agroconnect_orders', JSON.stringify(existingOrders));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return orderId;
    } catch (error: any) {
      console.error("Order creation error:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      signUp, 
      signIn, 
      signOut, 
      getUserOrders, 
      createOrder 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
