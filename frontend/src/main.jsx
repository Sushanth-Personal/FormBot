
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './main.css'
import { UserProvider } from "./Contexts/UserContext";

createRoot(document.getElementById('root')).render(

  <UserProvider>
    <App />
  </UserProvider>

)


// Register Service Worker (in production)
if (import.meta.env.MODE === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
}