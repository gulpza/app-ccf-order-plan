import { useState, useEffect, createContext, useContext } from 'react';
import { useLIFF } from './useLIFF';
import userService from '../services/userService';

// Create User Context
const UserContext = createContext();

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// User Context Provider Component
export const UserProvider = ({ children }) => {
  const { isLoggedIn, userProfile: liffProfile } = useLIFF();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data when logged in
  useEffect(() => {
    const loadUser = async () => {
      if (!isLoggedIn || !liffProfile?.userId) {
        setUser(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await userService.getUserProfile(liffProfile.userId);
        if (response.user) {
          setUser({
            ...response.user,
            lineProfile: liffProfile
          });
        } else {
          // User not found in system - this should trigger registration
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [isLoggedIn, liffProfile]);

  // Register new user
  const registerUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.registerUser({
        ...userData,
        lineUserId: liffProfile.userId,
        displayName: liffProfile.displayName,
        pictureUrl: liffProfile.pictureUrl
      });

      if (response.success) {
        setUser({
          ...response.user,
          lineProfile: liffProfile
        });
        return response.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.updateUserProfile({
        ...userData,
        lineUserId: liffProfile.userId
      });

      if (response.success) {
        setUser(prev => ({
          ...prev,
          ...response.user
        }));
        return response.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user data
  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    registerUser,
    updateUser,
    clearUser,
    // Computed values
    isRegistered: !!user,
    displayName: user?.name || liffProfile?.displayName || 'ผู้ใช้งาน',
    farmName: user?.farmName || null
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};