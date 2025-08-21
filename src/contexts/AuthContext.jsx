// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "services/authService";

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login with email and password
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to sign in with Google. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register with email and password
  const register = useCallback(async (email, password, name) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.createUserWithEmailAndPassword(
        email,
        password
      );
      
      await authService.updateProfile({
        displayName: name
      });
      
      return result;
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to create account. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to sign out. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to send password reset email. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateUserProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.updateProfile(profileData);
      setUser((prevUser) => ({ ...prevUser, ...profileData }));
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Failed to update profile. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};