import { useEffect, useState } from "react";

/**
 * Custom hook for fetching data from Firestore
 * Handles both guest and authenticated users
 * Includes automatic retry logic and error handling
 * 
 * @param {Function} fetchFn - Async function to fetch data (e.g., listProducts, listCourses)
 * @param {Array} fallbackData - Default data if fetch fails
 * @param {Object} options - Configuration options
 * @returns {Object} { data, loading, error }
 */
export function useFirestoreData(fetchFn, fallbackData = [], options = {}) {
  const {
    retryCount = 3,
    retryDelay = 1000,
    logErrors = true,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimeout;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the fetch function
        const result = await fetchFn();

        // Check if component was unmounted
        if (cancelled) return;

        // Validate result is an array
        if (Array.isArray(result) && result.length > 0) {
          setData(result);
          setRetryAttempt(0);
          
          if (logErrors) {
            console.log(`✅ Data fetched successfully:`, {
              count: result.length,
              sample: result[0],
            });
          }
        } else {
          // Empty array from database
          setData(fallbackData);
          
          if (logErrors) {
            console.warn(
              `⚠️ Empty result from database, using fallback data (${fallbackData.length} items)`
            );
          }
        }
      } catch (err) {
        if (cancelled) return;

        const isPermissionError = err?.code === "permission-denied";
        const isNetworkError =
          err?.code === "unavailable" ||
          err?.code === "failed-precondition" ||
          err?.message?.includes("Network");

        if (logErrors) {
          console.error(`❌ Error fetching data:`, {
            code: err?.code,
            message: err?.message,
            isPermissionError,
            isNetworkError,
            retryAttempt,
            willRetry: retryAttempt < retryCount,
          });
        }

        // For permission errors, log security rule issue
        if (isPermissionError) {
          console.error(
            `🔐 FIRESTORE SECURITY RULES ARE BLOCKING ACCESS\n` +
            `💡 FIX: Update Firestore rules to allow read access for guest users\n` +
            `📖 See: FIRESTORE_SECURITY_RULES.md`
          );
        }

        // Retry logic for network/temporary errors
        if (
          (isNetworkError || isPermissionError === false) &&
          retryAttempt < retryCount
        ) {
          retryTimeout = setTimeout(() => {
            if (!cancelled) {
              setRetryAttempt((prev) => prev + 1);
            }
          }, retryDelay * Math.pow(2, retryAttempt)); // Exponential backoff

          return;
        }

        // Final fallback after all retries exhausted
        setData(fallbackData);
        setError(err);

        if (logErrors) {
          console.log(
            `📦 Using fallback data (${fallbackData.length} items) after ${retryAttempt} retries`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch data when component mounts or ready for retry
    fetchData();

    // Cleanup function
    return () => {
      cancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [fetchFn, fallbackData, retryCount, retryDelay, logErrors, retryAttempt]);

  return { data, loading, error };
}

export default useFirestoreData;
