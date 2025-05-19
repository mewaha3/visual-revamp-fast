
/**
 * This script removes declaration files before build to prevent TS6305 errors
 */
const fs = require('fs');
const path = require('path');

// Function to recursively find all .d.ts files in a directory
function findDTSFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findDTSFiles(filePath, fileList);
    } else if (file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find and delete all .d.ts files in src directory
const srcDir = path.resolve(__dirname, '..');

try {
  const dtsFiles = findDTSFiles(srcDir);
  
  console.log(`Found ${dtsFiles.length} .d.ts files to delete.`);
  
  dtsFiles.forEach(file => {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } catch (err) {
      console.error(`Error deleting ${file}:`, err.message);
    }
  });
  
  console.log('Declaration file cleanup complete.');
} catch (err) {
  console.error('Error during declaration file cleanup:', err.message);
}
