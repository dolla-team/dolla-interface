import { ReactNode, useEffect } from "react";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import LoadingMore from "@/components/loading/loading-more";

interface InfiniteScrollContainerProps {
  children: ReactNode;
  onLoadMore: () => void | Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  threshold?: number;
  className?: string;
  loadingMoreClassName?: string;
  onScroll?(e: any): void;
}

export default function InfiniteScrollContainer({
  children,
  onLoadMore,
  loading = false,
  hasMore = true,
  threshold = 100,
  className = "",
  loadingMoreClassName = "",
  onScroll
}: InfiniteScrollContainerProps) {
  const { containerRef, isLoading } = useInfiniteScroll(onLoadMore, {
    loading,
    hasMore,
    threshold
  });

  useEffect(() => {
    const _onScroll = (e: any) => {
      onScroll?.(e);
    };

    containerRef.current?.addEventListener("scroll", _onScroll);

    return () => {
      containerRef.current?.removeEventListener("scroll", _onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
      <LoadingMore
        loading={isLoading}
        hasMore={hasMore}
        className={loadingMoreClassName}
      />
    </div>
  );
}
