// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage} from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyAWhSJsogIGrpWePvv9B17xmf4HEXdnIFs",
  authDomain: "whatsapp-clone-8dd9f.firebaseapp.com",
  projectId: "whatsapp-clone-8dd9f",
  storageBucket: "whatsapp-clone-8dd9f.appspot.com",
  messagingSenderId: "506111369098",
  appId: "1:506111369098:web:85947ae0c1808597b13273",
  measurementId: "G-99BR600CQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);

export { auth, db, storage };