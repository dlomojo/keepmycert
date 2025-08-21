import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "config/firebase";

const COLLECTION_NAME = "vendors";

export const vendorsService = {
  // Get all vendors
  getAll: async () => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("name", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting vendors:", error);
      throw error;
    }
  },

  // Get a vendor by ID
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
        throw new Error("Vendor not found");
      }
    } catch (error) {
      console.error("Error getting vendor:", error);
      throw error;
    }
  },

  // Get vendors by category
  getByCategory: async (category) => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("category", "==", category),
        orderBy("name", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting vendors by category:", error);
      throw error;
    }
  },

  // Search vendors
  search: async (searchTerm) => {
    try {
      // Firestore doesn't support text search natively, so we're doing a client-side filter
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      const vendors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter vendors that contain the search term in name
      const searchTermLower = searchTerm.toLowerCase();
      return vendors.filter(vendor => 
        vendor.name.toLowerCase().includes(searchTermLower)
      );
    } catch (error) {
      console.error("Error searching vendors:", error);
      throw error;
    }
  }
};