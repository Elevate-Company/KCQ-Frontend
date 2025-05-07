/**
 * Utility for detecting and handling QR code scanner input
 */
import React from 'react';

// Configuration for scanner detection
const SCANNER_CONFIG = {
  // Maximum time between keystrokes to be considered scanner input (milliseconds)
  maxTimeBetweenChars: 100,
  
  // Time to wait after last character before processing (milliseconds)
  completionDelay: 500,
  
  // Minimum length of a QR code to be considered valid
  minLength: 5,
  
  // Characters that might appear at the start/end of scanner input to be trimmed
  trimChars: ['\r', '\n', '\t', ' '],
};

/**
 * Creates a detector for QR code scanner input
 * @param {Function} onScanComplete - Callback when a complete QR code is detected
 * @param {Function} onScanStart - Optional callback when scanning starts
 * @param {Function} onScanError - Optional callback when scan errors occur
 * @param {Object} config - Optional configuration
 * @returns {Object} - Scanner detector controller
 */
export function createScannerDetector(onScanComplete, onScanStart, onScanError, config = {}) {
  // Merge default config with provided config
  const scannerConfig = { ...SCANNER_CONFIG, ...config };
  
  // State variables
  let buffer = '';
  let lastCharTime = 0;
  let timeoutId = null;
  let isScanning = false;
  
  // Process a complete scan
  const processScan = () => {
    // Clean up the scanned value
    let code = buffer.trim();
    
    // Remove any unwanted chars
    scannerConfig.trimChars.forEach(char => {
      code = code.replace(new RegExp(char, 'g'), '');
    });
    
    // Reset state
    buffer = '';
    isScanning = false;
    
    // Validate length
    if (code.length < scannerConfig.minLength) {
      if (onScanError) {
        onScanError(`QR code too short: ${code}`);
      }
      return;
    }
    
    // Call the completion callback
    if (onScanComplete) {
      onScanComplete(code);
    }
  };
  
  // Handler for keydown events
  const handleKeyDown = (event) => {
    // Only process printable characters or Enter
    if (
      (event.key.length === 1 || event.key === 'Enter') &&
      !event.ctrlKey && 
      !event.altKey && 
      !event.metaKey
    ) {
      const currentTime = new Date().getTime();
      
      // If this is the first character or it's been a long time since last character
      if (!lastCharTime || (currentTime - lastCharTime) > 1000) {
        // First character or very delayed - could be start of scanner or manual type
        buffer = event.key;
        isScanning = true; // Assume it might be scanning
        if (onScanStart) {
          onScanStart();
        }
      } 
      // If characters are coming in quickly (like from a scanner)
      else if ((currentTime - lastCharTime) < scannerConfig.maxTimeBetweenChars) {
        // Part of scanner input
        if (!isScanning) {
          isScanning = true;
          if (onScanStart) {
            onScanStart();
          }
        }
        
        // Handle Enter key as completion
        if (event.key === 'Enter') {
          event.preventDefault();
          if (buffer.length > 0) {
            // Clear any pending timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            processScan();
          }
        } else {
          buffer += event.key;
          // Don't prevent default here, let the character be typed
        }
      } else {
        // Probably manual typing or another source
        buffer += event.key;
      }
      
      // Update last character time
      lastCharTime = currentTime;
      
      // Set a timeout to automatically process scan after delay
      if (isScanning) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          if (buffer.length > 0) {
            processScan();
          }
        }, scannerConfig.completionDelay);
      }
    }
  };
  
  // Initialization function
  const init = () => {
    document.addEventListener('keydown', handleKeyDown);
  };
  
  // Cleanup function
  const destroy = () => {
    document.removeEventListener('keydown', handleKeyDown);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
  
  // Return the controller
  return {
    init,
    destroy,
    isScanning: () => isScanning,
  };
}

/**
 * Hook for using scanner detector in React components
 * @param {Function} onScanComplete - Callback when a complete QR code is detected
 * @param {Function} onScanStart - Optional callback when scanning starts
 * @param {Function} onScanError - Optional callback when scan errors occur
 * @param {Object} config - Optional configuration
 * @returns {Object} - Scanner detector controller
 */
export function useScannerDetector(onScanComplete, onScanStart, onScanError, config = {}) {
  const detectorRef = React.useRef(null);
  
  React.useEffect(() => {
    // Create and initialize the detector
    detectorRef.current = createScannerDetector(
      onScanComplete, 
      onScanStart, 
      onScanError, 
      config
    );
    
    detectorRef.current.init();
    
    // Clean up on unmount
    return () => {
      if (detectorRef.current) {
        detectorRef.current.destroy();
      }
    };
  }, [onScanComplete, onScanStart, onScanError, config]);
  
  // Return the current detector
  return detectorRef.current;
}

export default {
  createScannerDetector,
  useScannerDetector
}; 