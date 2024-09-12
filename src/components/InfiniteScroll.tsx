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

  useEffect(() => {
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          (!props.isLoadingMore || !props.isLoadingIntial)
        ) {
          props.loadMore();
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (observerElement.current) {
      observer.observe(observerElement.current);
    }

    return () => observer.disconnect();
  }, [props]);

  return (
    <>
      <>{props.children}</>

      <div ref={observerElement} id="obs">
        {props.isLoadingMore && !props.isLoadingIntial && (
          <div className="wrapper flex justify-center items-center h-20">
            <LoadingIconTwo className="animate-spin size-7 " />
          </div>
        )}
      </div>
    </>
  );
}

export default InfiniteScroll;
