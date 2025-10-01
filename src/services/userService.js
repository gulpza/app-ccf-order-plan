// User API Service for Google Apps Script integration

class UserService {
  constructor() {
    this.apiKey = import.meta.env.VITE_SHEET_API_KEY; // Google Apps Script URL from environment variable
    this.baseUrl = this.apiKey; // Google Apps Script URL
  }

  // Check if user exists in the system by LINE User ID
  async checkUserExists(lineUserId) {
    try {
      const params = new URLSearchParams({
        action: 'get-user-line',
        lineId: lineUserId
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
       console.log('👤 User check response:', data.length);
      console.log('👤 User check response:', data);
      
      return {
        status: data.length > 0 ? true : false,
        message: data.length > 0 ? 'User found' : 'User not found',
        data: data[0]
      };
    } catch (error) {
      console.error('❌ Error checking user existence:', error);
      throw error;
    }
  }

  // Register new user
  async registerUser(userData) {
    try {
      console.log('📝 Registering new user:', userData);
      
      const params = new URLSearchParams({
        action: 'register-user',
        lineUserId: userData.lineUserId,
        displayName: userData.displayName,
        name: userData.name || '',
        phone: userData.phone || '',
        farmName: userData.farmName || '',
        pictureUrl: userData.pictureUrl || ''
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ User registration response:', data);
      
      return {
        success: data.success || false,
        user: data.user || null,
        message: data.message || ''
      };
    } catch (error) {
      console.error('❌ Error registering user:', error);
      throw error;
    }
  }

  // Get user profile by LINE User ID
  async getUserProfile(lineUserId) {
    try {
      console.log('👤 Getting user profile for:', lineUserId);
      
      const params = new URLSearchParams({
        action: 'get-user',
        lineUserId: lineUserId
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📋 User profile response:', data);
      
      return {
        user: data.user || null,
        message: data.message || ''
      };
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userData) {
    try {
      console.log('🔄 Updating user profile:', userData);
      
      const params = new URLSearchParams({
        action: 'update-user',
        lineUserId: userData.lineUserId,
        name: userData.name || '',
        phone: userData.phone || '',
        farmName: userData.farmName || '',
        displayName: userData.displayName || '',
        pictureUrl: userData.pictureUrl || ''
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ User profile update response:', data);
      
      return {
        success: data.success || false,
        user: data.user || null,
        message: data.message || ''
      };
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new UserService();