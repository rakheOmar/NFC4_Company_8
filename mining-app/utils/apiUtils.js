// utils/apiUtils.js
import { ApiResponse } from './ApiResponse'; // assuming ApiResponse.js is in the same directory

// API call with backoff and retry logic
const callApiWithBackoff = async (apiCall, maxRetries = 5, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await apiCall();
            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`API call failed with status ${response.status}. Retrying...`);
                }
            }
            return response;
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed: ${error.message}`);
            if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
            } else {
                throw error;
            }
        }
    }
};

export { callApiWithBackoff, ApiResponse };