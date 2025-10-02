import { useState } from 'react';
import axios from 'axios';

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SHEET_API_KEY;

  // Function to get user profile by LINE ID
  const getUserProfile = async (lineId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Getting user profile for lineId:', lineId);
      
      const response = await axios.get(apiUrl, {
        params: {
          action: "get-user-line",
          lineId: lineId
        },
        timeout: 30000,
      });

      console.log('📥 getUserProfile response:', response.data);

      if (response.data && response.data.length > 0) {
        const userData = response.data[0]; // Get first user from array
        console.log('✅ User profile found:', userData);
        
        // Store in localStorage for future use
        localStorage.setItem('profile', JSON.stringify(userData));
        
        return {
          success: true,
          data: userData,
          user: {
            lineId: userData.LineId,
            name: userData.Name,
            displayName: userData.DisplayName,
            phone: userData.Phone,
            farmName: userData.FarmName,
            farmCode: userData.FarmCode,
            userType: userData.UserType,
            status: userData.Status,
            createdDate: userData.CreatedDate,
            latestDate: userData.LatestDate
          }
        };
      } else {
        console.log('❌ No user profile found');
        return {
          success: false,
          message: 'ไม่พบข้อมูลผู้ใช้',
          data: null
        };
      }
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      return {
        success: false,
        error: error.message,
        data: null
      };
    } finally {
      setLoading(false);
    }
  };

  // Function to register new user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Registering user:', userData);
      
      const response = await axios.post(apiUrl, new URLSearchParams({
        action: 'add-user-line',
        lineId: userData.lineUserId,
        displayName: userData.displayName,
        name: userData.name,
        phone: userData.phone,
        farmName: userData.farmName
      }), {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      console.log('📥 registerUser response:', response.data);
      
      if (response.data) {
        console.log('✅ User registered successfully');
        
        // After successful registration, store userId
        if (userData.lineUserId) {
          localStorage.setItem('userId', userData.lineUserId);
        }
        
        return {
          success: true,
          data: response.data,
          message: 'ลงทะเบียนสำเร็จ'
        };
      } else {
        return {
          success: false,
          message: 'ไม่สามารถลงทะเบียนได้',
          data: null
        };
      }
    } catch (error) {
      console.error('❌ Error registering user:', error);
      setError('เกิดข้อผิดพลาดในการลงทะเบียน');
      return {
        success: false,
        error: error.message,
        data: null
      };
    } finally {
      setLoading(false);
    }
  };

  // Function to clear user data
  const clearUserData = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('profile');
    setError(null);
    console.log('🗑️ User data cleared');
  };

  // Function to check if user is registered
  const isUserRegistered = () => {
    const userId = localStorage.getItem('userId');
    const profile = localStorage.getItem('profile');
    return !!(userId && profile);
  };

  // Function to get stored user data
  const getStoredUserData = () => {
    try {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  };

  return {
    // Functions
    getUserProfile,
    registerUser,
    clearUserData,
    isUserRegistered,
    getStoredUserData,
    
    // States
    loading,
    error,
    
    // Computed values
    userId: localStorage.getItem('userId'),
    hasProfile: !!localStorage.getItem('profile')
  };
};

export default useUser;