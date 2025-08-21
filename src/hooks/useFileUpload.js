import { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "config/firebase";
import { v4 as uuidv4 } from "uuid";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Upload a file to Firebase Storage
   * 
   * @param {File} file - The file to upload
   * @param {string} path - Path in Firebase Storage where the file should be saved
   * @returns {Promise<string>} Download URL of the uploaded file
   */
  const uploadFile = useCallback(async (file, path = "uploads") => {
    if (!file) {
      throw new Error("No file provided");
    }

    setUploading(true);
    setUploadError(null);
    setProgress(0);

    try {
      // Create a unique filename
      const fileExtension = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const fullPath = `${path}/${fileName}`;

      // Create a storage reference
      const storageRef = ref(storage, fullPath);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload file. Please try again.");
      throw error;
    } finally {
      setUploading(false);
      setProgress(100);
    }
  }, []);

  /**
   * Delete a file from Firebase Storage
   * 
   * @param {string} url - Download URL of the file to delete
   * @returns {Promise<boolean>} Success status
   */
  const deleteFile = useCallback(async (url) => {
    if (!url) {
      return false;
    }

    try {
      // Extract the path from the URL
      const fileRef = ref(storage, url);
      
      // Delete the file
      await deleteObject(fileRef);
      
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }, []);

  return {
    uploadFile,
    deleteFile,
    uploading,
    uploadError,
    progress
  };
};