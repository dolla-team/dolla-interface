import { useEffect, useRef, useState, useCallback } from "react";
import { useDebounceFn } from "ahooks";

interface UseInfiniteScrollOptions {
  loading?: boolean;
  hasMore?: boolean;
  threshold?: number;
  debounceWait?: number;
}

export default function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    loading = false,
    hasMore = true,
    threshold = 100,
    debounceWait = 300
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    const isNearBottom = scrollHeight - scrollTop - clientHeight <= threshold;

    if (isNearBottom) {
      setIsLoading(true);
      Promise.resolve(onLoadMore()).finally(() => {
        setIsLoading(false);
      });
    }
  }, [loading, isLoading, hasMore, threshold, onLoadMore]);

  const { run: debouncedHandleScroll } = useDebounceFn(handleScroll, {
    wait: debounceWait
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      container.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [containerRef.current]);

  return {
    containerRef,
    isLoading: loading || isLoading
  };
}
