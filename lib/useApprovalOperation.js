/**
 * Custom React Hook for Approval Operations
 * 
 * Handles approval API calls with automatic toast notifications on rejection
 */

import { useState } from 'react';
import { showRejectionNotification, showSuccessToast } from './toast-notification';

/**
 * Custom hook for approval operations
 * @returns {Object} - Hook API
 */
export function useApprovalOperation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submit an operation for approval
   * @param {Object} operationData - Operation details
   * @returns {Promise<Object>} - Approval result
   */
  const submitForApproval = async (operationData) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Operation was rejected
        if (result.rejected) {
          // Show rejection notification with reason
          showRejectionNotification(result.reason || 'عملية مرفوضة', {
            operationType: operationData.operationType,
            domain: operationData.domain,
          });

          setError(result.reason || 'عملية مرفوضة');
          return { success: false, ...result };
        }

        // Other error
        throw new Error(result.message || 'خطأ في المعالجة');
      }

      // Operation approved
      if (result.approved) {
        showSuccessToast('✓ تمت الموافقة على العملية بنجاح');
      }

      return { success: true, ...result };
    } catch (err) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      showRejectionNotification(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    submitForApproval,
    isProcessing,
    error,
  };
}
