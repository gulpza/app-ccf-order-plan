# LINE LIFF Integration Setup Guide

## 📋 LINE LIFF Setup Instructions

### 1. สร้าง LINE Login Channel

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. Login ด้วย LINE Account
3. สร้าง Provider ใหม่หรือเลือก Provider ที่มีอยู่
4. คลิก "Create a new channel"
5. เลือกประเภท "LINE Login"
6. กรอกข้อมูล Channel:
   - **Channel name**: ฟาร์มจระเข้ - ระบบสั่งซื้อผัก
   - **Channel description**: ระบบจัดการรายการสั่งซื้อผักสำหรับฟาร์ม
   - **App types**: เลือก Web app
7. ยอมรับ Terms และ สร้าง Channel

### 2. สร้าง LIFF App

1. ใน Channel ที่สร้างแล้ว ไปที่แท็บ "LIFF"
2. คลิก "Add" เพื่อสร้าง LIFF App ใหม่
3. กรอกข้อมูล LIFF:
   - **LIFF app name**: ฟาร์มจระเข้ - สั่งซื้อผัก
   - **Size**: Full
   - **Endpoint URL**: https://your-app-domain.com (URL ของแอปที่ deploy แล้ว)
   - **Scope**:
     - ✅ profile
     - ✅ openid (ถ้าต้องการ OpenID Connect)
   - **Bot Link Feature**: ปิด (ถ้าไม่มี Bot)

### 3. Configure Environment Variables

1. Copy LIFF ID ที่ได้จากหน้า LIFF Console
2. แก้ไขไฟล์ `.env`:
   ```env
   VITE_LIFF_ID=YOUR_LIFF_ID_HERE
   ```
3. Replace `YOUR_LIFF_ID_HERE` ด้วย LIFF ID ที่ได้

### 4. Local Development Setup

สำหรับ Local Development ให้ใช้ ngrok หรือ similar service:

```bash
# Install ngrok
npm install -g ngrok

# Start your React app
npm run dev

# In another terminal, expose local server
ngrok http 5173
```

จากนั้นใส่ ngrok URL ใน LIFF Endpoint URL

### 5. Deploy to Production

1. Deploy แอปไปยัง hosting service (Vercel, Netlify, etc.)
2. อัปเดต LIFF Endpoint URL ด้วย production URL
3. อัปเดต environment variables ใน hosting service

### 6. Features ที่สามารถใช้ได้

#### ✅ User Profile

- ดึงข้อมูล displayName, pictureUrl, userId
- แสดง Login/Logout status

#### ✅ Share Target Picker

- แชร์รายละเอียด order ผ่าน Flex Message
- ส่งไปยัง friends หรือ groups

#### ✅ Send Messages

- ส่งสรุปรายการสั่งซื้อไปยัง chat ปัจจุบัน
- แจ้งเตือนข้อมูลสำคัญ

#### ✅ Platform Detection

- ตรวจสอบว่าทำงานใน LINE Client หรือ Browser
- แสดง UI ที่เหมาะสมตาม platform

### 7. Error Handling

แอปได้ handle error cases ดังนี้:

- LIFF initialization failed
- User cancel login
- Share/Send message ไม่ available
- Fallback เป็น native Web Share API

### 8. Development Debug

ใน development mode จะแสดง debug info ที่ header:

- LIFF Ready status
- In LINE Client status
- Login status
- User profile info

### 9. Testing Checklist

ทดสอบใน environments ต่างๆ:

- ✅ Desktop Browser
- ✅ Mobile Browser
- ✅ LINE App (iOS)
- ✅ LINE App (Android)
- ✅ Login/Logout flow
- ✅ Share functionality
- ✅ Send message feature

### 10. Security Notes

- LIFF ID สามารถเก็บไว้ใน client-side ได้ (ไม่เป็น secret)
- User data ควร validate ที่ backend
- Access token ควร handle อย่างปลอดภัย

---

## 🚀 Ready to Use!

หลังจากทำตามขั้นตอนข้างต้นแล้ว แอปจะสามารถทำงานใน LINE ได้เต็มรูปแบบ ผู้ใช้จะสามารถ:

1. เปิดแอปผ่าน LIFF URL ใน LINE
2. Login ด้วย LINE Account
3. ดูรายการสั่งซื้อผัก
4. แชร์รายการไปยังเพื่อนหรือกลุ่ม
5. ส่งสรุปข้อมูลไปยังแชท

🌱 **สำหรับฟาร์มจระเข้** - ระบบจัดการการสั่งซื้อผักแบบ Smart Farm!
