// src/utils/dateUtils.js
/**
 * Format a date string or Date object to a readable format
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";
  
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  };
  
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : dateString;
  
  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
};

/**
 * Calculate days until expiry
 * @param {string|Date} expiryDate - Expiry date string or Date object
 * @returns {number} Days until expiry (negative if expired)
 */
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return 0;
  
  const expiry = typeof expiryDate === 'string' 
    ? new Date(expiryDate) 
    : expiryDate;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Calculate relative time from now
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Relative time (e.g., "2 days ago", "in 3 months")
 */
export const getRelativeTime = (date) => {
  if (!date) return "";
  
  const targetDate = typeof date === 'string' 
    ? new Date(date) 
    : date;
  
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const diffInMs = targetDate - now;
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  
  if (Math.abs(years) > 0) {
    return rtf.format(years, "year");
  } else if (Math.abs(months) > 0) {
    return rtf.format(months, "month");
  } else if (Math.abs(days) > 0) {
    return rtf.format(days, "day");
  } else if (Math.abs(hours) > 0) {
    return rtf.format(hours, "hour");
  } else if (Math.abs(minutes) > 0) {
    return rtf.format(minutes, "minute");
  } else {
    return rtf.format(seconds, "second");
  }
};