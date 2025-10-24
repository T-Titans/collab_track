const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/types/index.ts',
  'src/components/ui/Input.tsx',
  'src/components/ui/Button.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Layout.tsx',
  'src/context/AuthContext.tsx',
  'src/pages/Login.tsx',
  'src/pages/Register.tsx',
  'src/pages/Dashboard.tsx',
  'src/App.tsx',
  'src/index.css'
];

console.log('🔍 Checking required files...\n');

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n' + (allFilesExist ? '🎉 All files are present! Ready to run.' : '⚠️ Some files are missing.'));