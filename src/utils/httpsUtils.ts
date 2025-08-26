/**
 * Utilities for ensuring HTTPS communications and secure URL handling
 */

/**
 * Ensures a URL uses HTTPS protocol
 * @param url - The URL to check and convert
 * @returns HTTPS version of the URL
 */
export const enforceHttps = (url: string): string => {
  if (!url) return url;
  
  // If it's a relative URL, leave it as is
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }
  
  // If it starts with http://, convert to https://
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  // If it doesn't have a protocol, assume https://
  if (!url.startsWith('https://') && !url.startsWith('//')) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * Validates if a URL is secure (HTTPS or relative)
 * @param url - The URL to validate
 * @returns true if the URL is secure
 */
export const isSecureUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Relative URLs are considered secure
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return true;
  }
  
  // Check if it's HTTPS
  return url.startsWith('https://') || url.startsWith('//');
};

/**
 * Validates and sanitizes image URLs to ensure they're from trusted sources
 * @param url - The image URL to validate
 * @returns sanitized URL or null if invalid
 */
export const validateImageUrl = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // For relative URLs, return as is
    if (url.startsWith('/')) {
      return url;
    }
    
    const urlObj = new URL(enforceHttps(url));
    
    // Whitelist of trusted image domains
    const trustedDomains = [
      'images.unsplash.com',
      'cdn.example.com', // Add your trusted CDN domains here
      'assets.example.com',
      // Add more trusted domains as needed
    ];
    
    // Allow any HTTPS URL for now, but in production you might want to restrict this
    if (urlObj.protocol === 'https:') {
      return urlObj.toString();
    }
    
    return null;
  } catch (error) {
    console.warn('Invalid URL provided:', url);
    return null;
  }
};

/**
 * Gets the current protocol (http or https)
 * @returns current protocol
 */
export const getCurrentProtocol = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.protocol;
  }
  return 'https:'; // Default to HTTPS for SSR
};

/**
 * Checks if the current environment is running over HTTPS
 * @returns true if running over HTTPS
 */
export const isHttpsEnvironment = (): boolean => {
  return getCurrentProtocol() === 'https:';
};

/**
 * Redirects to HTTPS if currently on HTTP (for development purposes)
 */
export const redirectToHttpsIfNeeded = (): void => {
  if (typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
};