
// server/api/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to users data file
const dataDirectory = path.join(process.cwd(), 'src/data');
const usersJsonPath = path.join(dataDirectory, 'users.json');

// Helper function to read users data
function readUsersData() {
  try {
    if (!fs.existsSync(usersJsonPath)) {
      // If file doesn't exist, create it with empty array
      fs.writeFileSync(usersJsonPath, '[]', 'utf8');
      return [];
    }
    const jsonData = fs.readFileSync(usersJsonPath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading users data:', error);
    return [];
  }
}

// Helper function to write users data
function writeUsersData(data) {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    fs.writeFileSync(usersJsonPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users data:', error);
    return false;
  }
}

// Register endpoint
router.post('/register', (req, res) => {
  try {
    const { first_name, last_name, email, password, ...otherFields } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'ข้อมูลไม่ครบถ้วน กรุณากรอกข้อมูลที่จำเป็น' 
      });
    }
    
    // Read current users
    const users = readUsersData();
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น' 
      });
    }
    
    // Add new user
    const newUser = {
      first_name,
      last_name,
      email,
      password, // Note: In a production app, this should be hashed
      fullName: `${first_name} ${last_name}`,
      ...otherFields,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Write updated users data
    if (writeUsersData(users)) {
      // Send response with user data (excluding password)
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ',
        user: userWithoutPassword
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' 
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' 
    });
  }
});

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
      });
    }
    
    // Read users data
    const users = readUsersData();
    
    // Find user with matching email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      // User found, return user data without password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        user: userWithoutPassword
      });
    } else {
      // Authentication failed
      return res.status(401).json({ 
        success: false, 
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' 
    });
  }
});

module.exports = router;
