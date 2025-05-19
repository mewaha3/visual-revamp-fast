
const fs = require('fs');
const path = require('path');

// Function to recursively find and delete .d.ts files
function deleteDtsFiles(directory) {
  const items = fs.readdirSync(directory);
  
  items.forEach(item => {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      deleteDtsFiles(itemPath);
    } else if (item.endsWith('.d.ts')) {
      // Delete .d.ts files
      fs.unlinkSync(itemPath);
      console.log(`Deleted: ${itemPath}`);
    }
  });
}

// Start the cleanup from the src directory
const srcDir = path.join(__dirname, '..');
console.log('Cleaning up .d.ts files from:', srcDir);
deleteDtsFiles(srcDir);
console.log('Cleanup complete!');
