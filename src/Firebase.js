// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyDxtlo9RGtFL7DHQmLl71lFW7yd0ODkLJQ',
  authDomain: 'listify-app-8cb23.firebaseapp.com',
  projectId: 'listify-app-8cb23',
  storageBucket: 'listify-app-8cb23.firebasestorage.app',
  messagingSenderId: '957906633640',
  appId: '1:957906633640:web:55b48b6aacfab06022139d',
  measurementId: 'G-63JB5XGCPT',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
