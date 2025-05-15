
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUser } from "./firebaseUserService";
import { initializeProducts } from "./firebaseProductService";
import { initializeOrders } from "./firebaseOrderService";

// Initialize all Firebase services
export const initializeFirebaseServices = async () => {
  try {
    console.log("Initializing Firebase services...");
    
    // Initialize products collection
    await initializeProducts();
    
    // Initialize orders collection
    await initializeOrders();
    
    console.log("Firebase services initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase services:", error);
  }
};

// Listen for auth state changes to create/update user profiles
export const initializeAuthListener = () => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await createOrUpdateUser(user);
      } catch (error) {
        console.error("Error in auth listener:", error);
      }
    }
  });
};
