// src/hooks/useCertifications.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "contexts/AuthContext";
import { certificationsService } from "services/certificationsService";

export const useCertifications = () => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all certifications
  const fetchCertifications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await certificationsService.getAllByUser(user.uid);
      setCertifications(data);
    } catch (err) {
      console.error("Error fetching certifications:", err);
      setError("Failed to load certifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get a single certification
  const getCertification = useCallback(async (id) => {
    if (!user) return null;
    
    try {
      return await certificationsService.getById(id);
    } catch (err) {
      console.error("Error fetching certification:", err);
      setError("Failed to load certification details. Please try again.");
      return null;
    }
  }, [user]);

  // Add a certification
  const addCertification = useCallback(async (certificationData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newCert = await certificationsService.create({
        ...certificationData,
        userId: user.uid
      });
      
      setCertifications(prev => [...prev, newCert]);
      return newCert;
    } catch (err) {
      console.error("Error adding certification:", err);
      setError("Failed to add certification. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update a certification
  const updateCertification = useCallback(async (id, certificationData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCert = await certificationsService.update(id, certificationData);
      
      setCertifications(prev => 
        prev.map(cert => cert.id === id ? updatedCert : cert)
      );
      
      return updatedCert;
    } catch (err) {
      console.error("Error updating certification:", err);
      setError("Failed to update certification. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Delete a certification
  const deleteCertification = useCallback(async (id) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await certificationsService.delete(id);
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting certification:", err);
      setError("Failed to delete certification. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load certifications on initial render
  useEffect(() => {
    if (user) {
      fetchCertifications();
    } else {
      setCertifications([]);
      setLoading(false);
    }
  }, [user, fetchCertifications]);

  return {
    certifications,
    loading,
    error,
    fetchCertifications,
    getCertification,
    addCertification,
    updateCertification,
    deleteCertification
  };
};