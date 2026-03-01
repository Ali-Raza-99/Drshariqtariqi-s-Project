import { useState, useEffect } from "react";
import { LOADING_STATE } from "../../theme/constants";

/**
 * Custom Hook for handling async data fetching
 * Provides: data, loading, error, retry
 * Industry standard pattern with proper error handling
 */
export function useFetchData(asyncFn, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetch = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      console.error("Fetch error:", error);
      setState({ 
        data: null, 
        loading: false, 
        error: error.message || "Failed to fetch data" 
      });
    }
  };

  useEffect(() => {
    fetch();
  }, dependencies);

  return {
    ...state,
    retry: fetch,
  };
}

/**
 * Hook for managing async submit operations
 * Provides: loading, error, success, submit
 */
export function useAsyncSubmit(asyncFn, onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || "Operation failed";
      setError(errorMsg);
      console.error("Submit error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}
