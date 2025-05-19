
const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับค้นหาและลบไฟล์ .d.ts แบบรีเคอร์ซีฟ
function deleteDtsFiles(directory) {
  const items = fs.readdirSync(directory);
  
  items.forEach(item => {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // ประมวลผลโฟลเดอร์ย่อยแบบรีเคอร์ซีฟ
      deleteDtsFiles(itemPath);
    } else if (item.endsWith('.d.ts')) {
      // ลบไฟล์ .d.ts
      fs.unlinkSync(itemPath);
      console.log(`ลบไฟล์: ${itemPath}`);
    }
  });
}

// เริ่มการทำความสะอาดจากโฟลเดอร์ src
const srcDir = path.join(__dirname, '..');
console.log('กำลังทำความสะอาดไฟล์ .d.ts จาก:', srcDir);
deleteDtsFiles(srcDir);
console.log('ทำความสะอาดเสร็จสมบูรณ์!');
