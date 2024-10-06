"use client";

import InfiniteScroll from "@/src/components/InfiniteScroll";
import ShelfPreview from "@/src/components/shelf/ShelfPreview";
import { getCreatedShelves } from "@/src/utils/shelves";
import { createClient } from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  isAuthUser: boolean;
  URLProfileID: string;
  authUserID: string | null;
};

function DisplayCreatedShelves(props: Props) {
  const { isAuthUser, URLProfileID, authUserID } = props;

  const supabase = createClient();

  const {
    isLoading,
    isError,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["created-shelves", URLProfileID],
    queryFn: ({ pageParam }) =>
      getCreatedShelves(supabase, pageParam, URLProfileID, authUserID),
    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number | undefined = lastPage?.length
        ? allPages?.length
        : undefined;

      return nextPage;
    },
  });

  if (isLoading) {
    return <p>Loading ... </p>;
  }

  if (isError) {
    return (
      <p className="wrapper">{"message" in error ? error.message : error}</p>
    );
  }

  if (!data || data.pages?.[0].length === 0) {
    return (
      <p className="wrapper mt-8 text-center">
        {isAuthUser
          ? `It looks like you haven't saved any books to this shelf yet.`
          : `This is user hasn't added any books to this shelf as yet.`}
      </p>
    );
  }

  const shelves = data.pages.flat();

  const renderedShelves = shelves
    // only show private shelves to the owner
    .filter((shelf) => {
      if (isAuthUser) return shelf;
      else return !shelf.private;
    })
    .map((shelf) => {
      return (
        <ShelfPreview
          key={shelf.id}
          authUserID={authUserID}
          isAuthUser={isAuthUser}
          shelf={shelf}
          URLProfileID={URLProfileID}
        />
      );
    });

  return (
    <>
      <InfiniteScroll
        isLoadingIntial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
      >
        <div className="wrapper shelves-grid pb-16">{renderedShelves}</div>
      </InfiniteScroll>
    </>
  );
}

export default DisplayCreatedShelves;
