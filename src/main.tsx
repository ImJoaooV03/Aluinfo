import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/i18n'
import { redirectToHttpsIfNeeded } from "./utils/httpsUtils.ts";

// Ensure HTTPS in production
redirectToHttpsIfNeeded();

createRoot(document.getElementById("root")!).render(<App />);
