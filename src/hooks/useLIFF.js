import { useState, useEffect } from 'react';
import LIFFService from '../utils/liff';

export const useLIFF = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isInLineClient, setIsInLineClient] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLIFF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const success = await LIFFService.init();
        
        if (success) {
          setIsReady(true);
          setIsInLineClient(LIFFService.isInLineClient());
          
          // Check login status
          if (LIFFService.isLoggedIn()) {
            setIsLoggedIn(true);
            const profile = await LIFFService.getUserProfile();
            setUserProfile(profile);
            
            // Store userId in localStorage when logged in
            if (profile?.userId) {
              localStorage.setItem('userId', profile.userId);
            }
            
          } else {
            // Clear userId from localStorage when not logged in
            localStorage.removeItem('userId');
            //  localStorage.setItem('userId', 1234);
          }
        } else {
          throw new Error('LIFF initialization failed');
        }
      } catch (error) {
        console.error('❌ LIFF initialization error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initLIFF();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profile = await LIFFService.login();
      setIsLoggedIn(true);
      setUserProfile(profile);
      
      // Store userId in localStorage when login successful
      if (profile?.userId) {
        localStorage.setItem('userId', profile.userId);
      }
      
      console.log('✅ Login successful:', profile);
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      LIFFService.logout();
      setIsLoggedIn(false);
      setUserProfile(null);
      
      // Clear userId from localStorage when logout
      localStorage.removeItem('userId');
      console.log('🗑️ UserId removed from localStorage');
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError(error.message);
    }
  };

  const shareOrder = async (orderData) => {
    try {
      setError(null);
      const success = await LIFFService.shareOrder(orderData);
      if (!success) {
        throw new Error('Share feature not available');
      }
      return true;
    } catch (error) {
      console.error('❌ Share error:', error);
      setError(error.message);
      return false;
    }
  };

  const sendMessage = async (message) => {
    try {
      setError(null);
      const success = await LIFFService.sendMessage(message);
      if (!success) {
        throw new Error('Send message feature not available');
      }
      return true;
    } catch (error) {
      console.error('❌ Send message error:', error);
      setError(error.message);
      return false;
    }
  };

  const closeWindow = () => {
    try {
      LIFFService.closeWindow();
    } catch (error) {
      console.error('❌ Close window error:', error);
    }
  };

  return {
    // States
    isReady,
    isLoggedIn,
    userProfile,
    isInLineClient,
    error,
    isLoading,
    
    // Methods
    login,
    logout,
    shareOrder,
    sendMessage,
    closeWindow,
    
    // Utility methods
    getOS: () => LIFFService.getOS(),
    getLineVersion: () => LIFFService.getLineVersion()
  };
};