import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { doc, getDocFromCache } from 'firebase/firestore';
import { db } from './services/firebase';
import App from './App.tsx';
import './index.css';

async function testConnection() {
  try {
    // Attempting to access a test doc to verify Firestore init
    await getDocFromCache(doc(db, 'test', 'connection'));
  } catch (error) {
    // If it fails with offline or similar, it's a good check
    console.log("Firestore connection check initiated.");
  }
}

testConnection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
