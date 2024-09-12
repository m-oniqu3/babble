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
    return (
      <p className="wrapper">
        {"message" in query.error ? query.error.message : query.error}
      </p>
    );
  }

  if (!query.data || query.data.pages.length === 0) {
    return (
      <p>It looks like you haven&apos;t saved any books to this shelf yet.</p>
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

// async function getBooksOnShelfClient(
//   URLProfileID: string,
//   shelfID: number,
//   page: number
// ) {
//   const supabase = createClient();
//   const range = getRange(page, 10);

//   const { data, error } = await supabase
//     .from("saved_books")
//     .select("*")
//     .eq("user_id", URLProfileID)
//     .eq("shelf_id", shelfID)
//     .order("created_at", { ascending: false })
//     .range(range[0], range[1]);

//   return { data, error };
// }

// async function getBookSnippetByID(
//   IDs: {
//     bookID: string;
//     coverID: string | null;
//   }[]
// ) {
//   try {
//     const baseURL = openLibraryBaseURL;

//     const booksPromises = IDs.map(async (item) => {
//       const response = await fetch(baseURL + "works/" + item.bookID + ".json");
//       const book = await response.json();

//       //use coverID from the db if it exists, otherwise use the first cover from the API
//       const coverID = item.coverID
//         ? item.coverID
//         : book.covers
//         ? book.covers[0]
//         : (null as string | null);

//       return {
//         title: book.title,
//         key: book.key,
//         authors: book.authors.map((author: any) => author.author.key),
//         cover: coverID,
//       } as BookSnippet;
//     });

//     const books = await Promise.all(booksPromises);

//     return books;
//   } catch (error) {
//     console.error("Error fetching book snippet:", error);
//     throw error;
//   }
// }

// // get the books on the shelf and then get the book info from the api
// async function getBooksByIDClient(
//   URLProfileID: string,
//   shelfID: number,
//   page: number
// ) {
//   try {
//     const { data, error } = await getBooksOnShelfClient(
//       URLProfileID,
//       shelfID,
//       page
//     );

//     if (error) throw error;

//     if (!data) return [];

//     const IDs = data.map((book) => {
//       return {
//         bookID: book.book_id,
//         coverID: book.cover_id,
//       };
//     });

//     const books = await getBookSnippetByID(IDs);

//     return books;
//   } catch (error: any) {
//     console.error("Error fetching books by ids:", error);

//     if ("message" in error) throw error.message;
//     else throw error;
//   }
// }
