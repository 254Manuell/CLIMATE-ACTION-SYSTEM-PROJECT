import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDjhdH3e_jddW-s1JoQLZZhKjLG3Rkjhaw",
  authDomain: "climate-action-system.firebaseapp.com",
  projectId: "climate-action-system",
  storageBucket: "climate-action-system.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);
export default app;
