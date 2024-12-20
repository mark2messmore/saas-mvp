import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAFcFJieO0Qtkpr8wEofFHaG3HdEocpjCQ",
    authDomain: "localagency-5bf8d.firebaseapp.com",
    projectId: "localagency-5bf8d",
    storageBucket: "localagency-5bf8d.firebasestorage.app",
    messagingSenderId: "536956779163",
    appId: "1:536956779163:web:890abf5e86d6d0bdc2a43e",
    measurementId: "G-JYZRZWTWRB"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
