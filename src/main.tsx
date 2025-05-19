
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Run the cleanup script before starting in development mode if needed
// By default, prebuild will handle the .d.ts file deletion before build
// To run this command before development, you can use:
// node src/scripts/cleanup.js && npm run dev
createRoot(document.getElementById("root")!).render(<App />);
