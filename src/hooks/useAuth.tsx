
import React, { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    User,
    updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUser, getUserProfile, updateUserProfile } from "@/services/firebaseUserService";

interface AuthContextType {
    user: User | null;
    userProfile: {
        displayName: string | null;
        address: string | null;
        phone: string | null;
    } | null;
    loading: boolean;
    register: (email: string, pass: string, name?: string) => Promise<void>;
    login: (email: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (data: { displayName?: string; address?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<AuthContextType['userProfile']>(null);
    const [loading, setLoading] = useState(true);

    // Load user profile when auth state changes
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            
            if (u) {
                try {
                    // Create or update the user profile in Firestore
                    const profile = await createOrUpdateUser(u);
                    setUserProfile({
                        displayName: profile.displayName,
                        address: profile.address,
                        phone: profile.phone
                    });
                } catch (error) {
                    console.error("Error loading user profile:", error);
                    setUserProfile({
                        displayName: u.displayName,
                        address: null,
                        phone: null
                    });
                }
            } else {
                setUserProfile(null);
            }
            
            setLoading(false);
        });
        
        return () => unsub();
    }, []);

    const register = async (email: string, pass: string, name?: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        
        // Set display name if provided
        if (name && result.user) {
            await updateProfile(result.user, { displayName: name });
            
            // Also update the Firestore profile
            await createOrUpdateUser(result.user);
        }
    };

    const login = (email: string, pass: string) =>
        signInWithEmailAndPassword(auth, email, pass).then(() => {});

    const loginWithGoogle = () =>
        signInWithPopup(auth, new GoogleAuthProvider()).then(() => {});

    const logoutUser = () => signOut(auth);

    const updateUserData = async (data: { displayName?: string; address?: string; phone?: string }) => {
        if (!user) return;
        
        // Update Firebase Auth display name if provided
        if (data.displayName && data.displayName !== user.displayName) {
            await updateProfile(user, { displayName: data.displayName });
        }
        
        // Update user profile in Firestore
        const updateData: Record<string, string | null> = {};
        if (data.displayName) updateData.displayName = data.displayName;
        if (data.address !== undefined) updateData.address = data.address || null;
        if (data.phone !== undefined) updateData.phone = data.phone || null;
        
        try {
            // Update Firestore profile
            await updateUserProfile(user.uid, updateData);
            
            // Update local state
            setUserProfile(prev => ({
                ...prev!,
                ...updateData
            }));
            
            // Refresh the user
            await user.reload();
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                userProfile,
                loading, 
                register, 
                login, 
                loginWithGoogle, 
                logout: logoutUser,
                updateUserData
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};
