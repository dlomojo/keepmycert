import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Create a new user with email and password
  createUserWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        plan: "free",
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await setDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          plan: "free",
        });
      } else {
        // Update last login
        await setDoc(doc(db, "users", userCredential.user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("No user logged in");
      }
      
      // Update Firebase Auth profile
      await fbUpdateProfile(user, profileData);
      
      // Update Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        ...profileData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return user;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  }
};