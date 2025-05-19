
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// รันสคริปต์ cleanup ก่อนเริ่มการทำงานในโหมด development ถ้าต้องการ
// โดยปกติ prebuild จะจัดการการลบไฟล์ .d.ts ก่อนการ build
createRoot(document.getElementById("root")!).render(<App />);
