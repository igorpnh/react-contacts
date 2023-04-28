import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOackQuRNE-c2Op750ajXgap3mg19wU40",
  authDomain: "contacts-list-6f37e.firebaseapp.com",
  projectId: "contacts-list-6f37e",
  storageBucket: "contacts-list-6f37e.appspot.com",
  messagingSenderId: "547586779880",
  appId: "1:547586779880:web:77dc31f8e862e5c9d2375d",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
