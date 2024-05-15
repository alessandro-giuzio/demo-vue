
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCq-hYLO8iO82JHwkyr9UEZfkoTtpZcYaU",
  authDomain: "noteapp-2588a.firebaseapp.com",
  projectId: "noteapp-2588a",
  storageBucket: "noteapp-2588a.appspot.com",
  messagingSenderId: "770131582427",
  appId: "1:770131582427:web:23fc45abd63bbf76e41bfe",
  measurementId: "G-XS2X8JN6GS"
}


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };