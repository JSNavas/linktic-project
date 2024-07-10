import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig: Record<string, unknown> = {
  apiKey: 'AIzaSyAnxR-371TgOY0d6gIzcACJvqWBJxg_SMU',
  authDomain: 'linktic-project.firebaseapp.com',
  projectId: 'linktic-project',
  storageBucket: 'linktic-project.appspot.com',
  messagingSenderId: '628372220508',
  appId: '1:628372220508:web:b0b1cb65e41663f136d499',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
