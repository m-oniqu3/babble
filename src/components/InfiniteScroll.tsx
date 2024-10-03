import { LoadingIconTwo } from "@/src/components/icons";
import React, { useEffect, useRef } from "react";

type Props = {
  isLoadingIntial: boolean;
  isLoadingMore: boolean;
  children: React.ReactNode;
  loadMore: () => void;
};

function InfiniteScroll(props: Props) {
  const observerElement = useRef<HTMLDivElement | null>(null);
  const { isLoadingIntial, isLoadingMore, children, loadMore } = props;

  useEffect(() => {
    // is element in view?
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!isLoadingMore || !isLoadingIntial)) {
          loadMore();
        }
      });
    }

    // create observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (observerElement.current) {
      observer.observe(observerElement.current);
    }

    // cleanup function
    return () => observer.disconnect();
  }, [isLoadingMore, isLoadingIntial, loadMore]);

  return (
    <>
      <>{children}</>

      <div ref={observerElement} id="obs">
        {isLoadingMore && !isLoadingIntial && (
          <div className="wrapper flex justify-center items-center h-20">
            <LoadingIconTwo className="size-7 " />
          </div>
        )}
      </div>
    </>
  );
}

export default InfiniteScroll;
