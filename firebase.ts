import { initializeApp } from 'firebase/app';
import { clientConfig } from './config';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(clientConfig);
const db = getFirestore(app);

export { app, db };
