import liff from '@line/liff';

// LIFF Configuration - Using Vite environment variables
const LIFF_ID = import.meta.env.VITE_LIFF_ID || '2008159875-zaa3nly3';

class LIFFService {
  constructor() {
    this.isInitialized = false;
    this.isInClient = false;
    this.userProfile = null;
  }

  // Initialize LIFF
  async init() {
    try {
      console.log('🚀 Initializing LIFF...');
      await liff.init({ liffId: LIFF_ID });
      this.isInitialized = true;
      this.isInClient = liff.isInClient();
      
      console.log('✅ LIFF initialized successfully');
      console.log('📱 Running in LINE client:', this.isInClient);
      console.log('🔐 User logged in:', liff.isLoggedIn());
      
      return true;
    } catch (error) {
      console.error('❌ LIFF initialization failed:', error);
      return false;
    }
  }

  // Check if LIFF is initialized
  isReady() {
    return this.isInitialized;
  }

  // Check if running in LINE client
  isInLineClient() {
    return this.isInClient;
  }

  // Login user
  async login() {
    try {
      if (!this.isInitialized) {
        throw new Error('LIFF not initialized');
      }

      if (!liff.isLoggedIn()) {
        await liff.login({
          redirectUri: window.location.href
        });
      }

      // Get user profile after login
      this.userProfile = await liff.getProfile();
      console.log('👤 User profile:', this.userProfile);
      
      return this.userProfile;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    if (this.isInitialized && liff.isLoggedIn()) {
      liff.logout();
      this.userProfile = null;
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      if (!this.isInitialized) {
        throw new Error('LIFF not initialized');
      }

      if (!liff.isLoggedIn()) {
        return null;
      }

      if (!this.userProfile) {
        this.userProfile = await liff.getProfile();
      }

      return this.userProfile;
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      return null;
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.isInitialized && liff.isLoggedIn();
  }

  // Share target picker for orders
  async shareOrder(orderData) {
    try {
      if (!this.isInitialized || !this.isInClient) {
        throw new Error('LIFF not initialized or not in LINE client');
      }

      const shareMessage = {
        type: 'flex',
        altText: `📋 รายการสั่งซื้อผัก - ${orderData.vegetableName}`,
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://via.placeholder.com/800x400/2d5a3d/ffffff?text=🥬+ฟาร์มจระเข้',
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '🌱 ฟาร์มจระเข้',
                weight: 'bold',
                size: 'xl',
                color: '#2d5a3d'
              },
              {
                type: 'text',
                text: 'รายการสั่งซื้อผัก',
                size: 'md',
                color: '#6cb866',
                margin: 'md'
              },
              {
                type: 'separator',
                margin: 'lg'
              },
              {
                type: 'box',
                layout: 'vertical',
                margin: 'lg',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: '🥬 ผัก:',
                        color: '#2d5a3d',
                        size: 'sm',
                        flex: 2,
                        weight: 'bold'
                      },
                      {
                        type: 'text',
                        text: orderData.vegetableName,
                        wrap: true,
                        color: '#333333',
                        size: 'sm',
                        flex: 3
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: '📦 จำนวน:',
                        color: '#2d5a3d',
                        size: 'sm',
                        flex: 2,
                        weight: 'bold'
                      },
                      {
                        type: 'text',
                        text: `${orderData.quantity} กก.`,
                        wrap: true,
                        color: '#333333',
                        size: 'sm',
                        flex: 3
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: '📅 วันส่ง:',
                        color: '#2d5a3d',
                        size: 'sm',
                        flex: 2,
                        weight: 'bold'
                      },
                      {
                        type: 'text',
                        text: this.formatDate(orderData.deliveryDate),
                        wrap: true,
                        color: '#333333',
                        size: 'sm',
                        flex: 3
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: '💰 ราคา:',
                        color: '#2d5a3d',
                        size: 'sm',
                        flex: 2,
                        weight: 'bold'
                      },
                      {
                        type: 'text',
                        text: `฿${orderData.totalPrice.toLocaleString()}`,
                        wrap: true,
                        color: '#4caf50',
                        size: 'sm',
                        flex: 3,
                        weight: 'bold'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: '📋 สถานะ:',
                        color: '#2d5a3d',
                        size: 'sm',
                        flex: 2,
                        weight: 'bold'
                      },
                      {
                        type: 'text',
                        text: orderData.status,
                        wrap: true,
                        color: this.getStatusColor(orderData.status),
                        size: 'sm',
                        flex: 3,
                        weight: 'bold'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                action: {
                  type: 'uri',
                  label: 'ดูรายละเอียดเพิ่มเติม',
                  uri: window.location.href
                },
                color: '#2d5a3d'
              }
            ]
          }
        }
      };

      if (liff.isApiAvailable('shareTargetPicker')) {
        await liff.shareTargetPicker([shareMessage]);
        console.log('✅ Order shared successfully');
        return true;
      } else {
        console.warn('⚠️ Share target picker not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to share order:', error);
      throw error;
    }
  }

  // Send message to chat
  async sendMessage(text) {
    try {
      if (!this.isInitialized || !this.isInClient) {
        throw new Error('LIFF not initialized or not in LINE client');
      }

      if (liff.isApiAvailable('sendMessages')) {
        await liff.sendMessages([{
          type: 'text',
          text: text
        }]);
        console.log('✅ Message sent successfully');
        return true;
      } else {
        console.warn('⚠️ Send messages not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  // Close LIFF window
  closeWindow() {
    if (this.isInitialized && this.isInClient) {
      liff.closeWindow();
    }
  }

  // Get OS info
  getOS() {
    if (!this.isInitialized) return null;
    return liff.getOS();
  }

  // Get LINE version
  getLineVersion() {
    if (!this.isInitialized) return null;
    return liff.getLineVersion();
  }

  // Utility methods
  formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() + 543); // Buddhist era
    return `${day}/${month}/${year}`;
  }

  getStatusColor(status) {
    const colorMap = {
      'รอส่ง': '#8bc34a',
      'ส่งแล้ว': '#4caf50',
      'ยกเลิก': '#ef5350'
    };
    return colorMap[status] || '#8bc34a';
  }
}

// Export singleton instance
export default new LIFFService();