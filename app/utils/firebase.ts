import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDjhdH3e_jddW-s1JoQLZZhKjLG3Rkjhaw",
  authDomain: "climate-action-system.firebaseapp.com",
  projectId: "climate-action-system",
  storageBucket: "climate-action-system.appspot.com",
  messagingSenderId: "843592467120",
  appId: "1:843592467120:web:a5d8e3f8b0e3a7c9b8d6e5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
