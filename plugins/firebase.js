
import { initializeApp, getApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyAwTXndTLOu0VyObDK5k-fTUqW9XEeg_tw",
    authDomain: "sdtest-project.firebaseapp.com",
    projectId: "sdtest-project",
    storageBucket: "sdtest-project.appspot.com",
    messagingSenderId: "1065175353247",
    appId: "1:1065175353247:web:1bc7e3e9b448f89982dfaa"
};
 
const apps = getApp();

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];

export const messaging = getMessaging(app);