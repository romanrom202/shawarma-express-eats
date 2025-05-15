
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { User } from "firebase/auth";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  address: string | null;
  phone: string | null;
  createdAt: string;
  lastLoginAt: string;
}

const USERS_COLLECTION = "users";

// Create or update user profile when user logs in
export const createOrUpdateUser = async (user: User): Promise<UserProfile> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);
    
    const now = new Date().toISOString();
    
    if (!userSnap.exists()) {
      // Create new user profile
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Користувач',
        address: null,
        phone: null,
        createdAt: now,
        lastLoginAt: now
      };
      
      await setDoc(userRef, newUser);
      return newUser;
    } else {
      // Update existing user's last login
      const existingUser = userSnap.data() as UserProfile;
      await updateDoc(userRef, {
        lastLoginAt: now,
        email: user.email // Update email in case it changed
      });
      
      return {
        ...existingUser,
        lastLoginAt: now,
        email: user.email
      };
    }
  } catch (error) {
    console.error("Error managing user profile:", error);
    throw new Error("Failed to manage user profile");
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Update user profile fields
export const updateUserProfile = async (
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'lastLoginAt'>>
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, updates);
    
    // Get the updated profile
    const updatedSnap = await getDoc(userRef);
    if (updatedSnap.exists()) {
      return updatedSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
};

// Get all users
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersQuery = query(collection(db, USERS_COLLECTION));
    const querySnapshot = await getDocs(usersQuery);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};
