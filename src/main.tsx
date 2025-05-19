
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// รันสคริปต์ cleanup ก่อนเริ่มการทำงานในโหมด development ถ้าต้องการ
// โดยปกติ prebuild จะจัดการการลบไฟล์ .d.ts ก่อนการ build
// ถ้าต้องการรันคำสั่งนี้ก่อนการพัฒนา สามารถใช้คำสั่ง: 
// node src/scripts/cleanup.js && npm run dev
createRoot(document.getElementById("root")!).render(<App />);
