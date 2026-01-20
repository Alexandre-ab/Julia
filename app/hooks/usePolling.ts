import { useEffect, useRef, useCallback, useState } from 'react';

interface UsePollingOptions<T> {
    enabled?: boolean;
    interval?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

/**
 * Hook générique pour le polling HTTP
 */
export const usePolling = <T,>(
    fetchFunction: () => Promise<T>,
    options: UsePollingOptions<T> = {}
) => {
    const { enabled = true, interval = 3000, onSuccess, onError } = options;

    const [data, setData] = useState<T | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    const poll = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            setIsPolling(true);
            const result = await fetchFunction();

            if (isMountedRef.current) {
                setData(result);
                setError(null);
                onSuccess?.(result);
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Polling error');

            if (isMountedRef.current) {
                setError(error);
                onError?.(error);
            }
        } finally {
            if (isMountedRef.current) {
                setIsPolling(false);
            }
        }
    }, [fetchFunction, onSuccess, onError]);

    useEffect(() => {
        isMountedRef.current = true;

        if (enabled) {
            // Polling initial immédiat
            poll();

            // Puis toutes les X secondes
            intervalRef.current = setInterval(poll, interval);
        }

        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval, poll]);

    const refresh = useCallback(() => {
        poll();
    }, [poll]);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    return {
        data,
        isPolling,
        error,
        refresh,
        stop,
    };
};

export default usePolling;
