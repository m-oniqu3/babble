"use client";

import Snippet from "@/src/components/books/Snippet";
import InfiniteScroll from "@/src/components/InfiniteScroll";
import { getBooksByID } from "@/src/utils/getBooksOnShelf";
import { createClient } from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  URLProfileID: string;
  shelfID: number;
  authUserID: string | null;
};

function BookSnippets(props: Props) {
  const { URLProfileID, shelfID, authUserID } = props;

  const query = useInfiniteQuery({
    queryKey: ["book-snippets", URLProfileID, shelfID],
    queryFn: ({ pageParam }) =>
      getBooksByID(createClient(), URLProfileID, shelfID, pageParam),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number | undefined = lastPage?.length
        ? allPages?.length
        : undefined;

      return nextPage;
    },
  });

  // if (query.isLoading) {
  //   return (
  //     <LoadingIconTwo className="wrapper animate-spin size-7 text-gray-500" />
  //   );
  // }

  if (query.isError) {
    console.log("rq error", query.error);
    return (
      <p className="wrapper">
        {"message" in query.error ? query.error.message : query.error}
      </p>
    );
  }

  if (!query.data || query.data.pages.flat().length === 0) {
    const isAuthUser = authUserID === URLProfileID;

    return (
      <p className="wrapper text-center mt-12">
        {isAuthUser
          ? "You haven't added any books to this shelf yet"
          : "This user hasn't added any books to this shelf yet"}
      </p>
    );
  }

  const pages = query.data.pages.flat();

  const renderBooks = pages.map((book, index) => {
    return (
      <Snippet
        key={index}
        book={book}
        URLProfileID={URLProfileID}
        authUserID={authUserID}
      />
    );
  });

  return (
    <div className="wrapper">
      <InfiniteScroll
        isLoadingIntial={query.isLoading}
        isLoadingMore={query.isFetchingNextPage}
        loadMore={() => query.hasNextPage && query.fetchNextPage()}
      >
        <ul className="snippets-wrapper">{renderBooks}</ul>
      </InfiniteScroll>
    </div>
  );
}

export default BookSnippets;
