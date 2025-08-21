import { useState, useEffect, useCallback } from "react";
import { vendorsService } from "services/vendorsService";

export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all vendors
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await vendorsService.getAll();
      setVendors(data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single vendor
  const getVendor = useCallback(async (id) => {
    try {
      return await vendorsService.getById(id);
    } catch (err) {
      console.error("Error fetching vendor:", err);
      setError("Failed to load vendor details. Please try again.");
      return null;
    }
  }, []);

  // Load vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    getVendor
  };
};