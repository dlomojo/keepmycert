// src/services/certificationsService.js
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "config/firebase";

const COLLECTION_NAME = "certifications";

export const certificationsService = {
  // Get all certifications for a user
  getAllByUser: async (userId) => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting certifications:", error);
      throw error;
    }
  },

  // Get a certification by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error("Certification not found");
      }
    } catch (error) {
      console.error("Error getting certification:", error);
      throw error;
    }
  },

  // Create a new certification
  create: async (certificationData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...certificationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...certificationData
      };
    } catch (error) {
      console.error("Error creating certification:", error);
      throw error;
    }
  },

  // Update a certification
  update: async (id, certificationData) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      await updateDoc(docRef, {
        ...certificationData,
        updatedAt: serverTimestamp()
      });
      
      return {
        id,
        ...certificationData
      };
    } catch (error) {
      console.error("Error updating certification:", error);
      throw error;
    }
  },

  // Delete a certification
  delete: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting certification:", error);
      throw error;
    }
  }
};