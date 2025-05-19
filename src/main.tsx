
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// คำอธิบายการแก้ปัญหาโดยไม่ต้องแก้ไข tsconfig.json:
/*
 * เนื่องจากเราไม่สามารถแก้ไข tsconfig.json เพื่อตั้งค่า `"declaration": false` หรือ `"noEmit": true` ได้
 * เราจึงใช้สคริปต์ pre-build เพื่อลบไฟล์ .d.ts ทั้งหมดในโฟลเดอร์ src/
 * วิธีนี้แก้ไขปัญหา TS6305 โดยการทำให้แน่ใจว่าไม่มีไฟล์ declaration เก่าที่ไม่ตรงกับไฟล์ต้นฉบับ
 * สามารถรันด้วยคำสั่ง:
 * npm run cleanup && npm run build
 * หรือตั้งค่าสคริปต์ prebuild ใน package.json:
 * "prebuild": "node src/scripts/cleanup.js"
 */

createRoot(document.getElementById("root")!).render(<App />);
