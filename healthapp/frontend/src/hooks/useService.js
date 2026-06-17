import { useState, useEffect } from 'react';

/**
 * useService — Custom hook to subscribe to an Angular-style RxJS Service.
 * Includes defensive checks to prevent runtime crashes during SSR or initialization.
 */
export function useService(observable) {
  const [value, setValue] = useState(() => {
    // Defensive check: prevent crashes if observable is not yet defined
    if (!observable) return null;
    return 'getValue' in observable ? observable.getValue() : null;
  });

  useEffect(() => {
    // Safety check for production environments
    if (!observable || typeof observable.subscribe !== 'function') {
      return;
    }

    const subscription = observable.subscribe(
      (val) => setValue(val),
      (err) => console.error('Service subscription error:', err)
    );

    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}

export default useService;
