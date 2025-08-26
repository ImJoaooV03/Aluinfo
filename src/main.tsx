import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { redirectToHttpsIfNeeded } from "./utils/httpsUtils.ts";

// Ensure HTTPS in production
redirectToHttpsIfNeeded();

createRoot(document.getElementById("root")!).render(<App />);
