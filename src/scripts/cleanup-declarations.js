
/**
 * This script removes declaration files before build to prevent TS6305 errors
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to recursively find all .d.ts files in a directory
function findDTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
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
const dtsFiles = findDTSFiles(srcDir);

console.log(`Found ${dtsFiles.length} .d.ts files to delete.`);

dtsFiles.forEach(file => {
  fs.unlinkSync(file);
  console.log(`Deleted: ${file}`);
});

console.log('Declaration file cleanup complete.');
