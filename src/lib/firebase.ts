
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Using the configuration from the FirebaseConfig.ts file 
// to avoid duplicating configuration
import { firebaseConfig } from "./FirebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
