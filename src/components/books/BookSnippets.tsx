"use client";

import Snippet from "@/src/components/books/Snippet";
import { LoadingIcon } from "@/src/components/icons";
import { type BookSnippet } from "@/src/types/books";
import { openLibraryBaseURL } from "@/src/utils/openLibrary";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  initialBooks: BookSnippet[];
  initialRange: number[];
  URLProfileID: string;
  shelfID: number;
  authUserID: string | null;
};

function BookSnippets(props: Props) {
  const { initialBooks, initialRange, URLProfileID, shelfID, authUserID } =
    props;
  const [books, setBooks] = useState<BookSnippet[]>(initialBooks);
  const [range, setRange] = useState<number[]>(initialRange);
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMoreSavedBooks() {
      setIsLoading(true);

      const start = range[1] + 1;
      const end = start + 3;
      try {
        const newRange = [start, end];
        const { data, error } = await getBooksByIDClient(
          URLProfileID,
          shelfID,
          newRange
        );

        if (error) throw error;

        if (!data || data.length === 0) {
          console.error("No books found");
          return;
        }

        // add the new books to the existing list & update the range
        setBooks((prev) => [...prev].concat(data));
        setRange(newRange);
      } catch (error) {
        console.error("Error loading more books:", error);
        setError("Error loading more books");
      } finally {
        setIsLoading(false);
      }
    }

    if (inView) {
      console.log("Loading more books");

      loadMoreSavedBooks();
    }
  }, [inView]);

  const renderBooks = books.map((book, index) => {
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
      <ul className="snippets-wrapper">{renderBooks}</ul>

      {error && <p>{error}</p>}

      <div ref={ref} className="h-20 ">
        {isLoading && (
          <div className="w-full flex justify-center items-center h-full">
            <LoadingIcon className="animate-spin size-8 text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default BookSnippets;

async function getBooksOnShelfClient(
  URLProfileID: string,
  shelfID: number,
  range: number[]
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_books")
    .select("*")
    .eq("user_id", URLProfileID)
    .eq("shelf_id", shelfID)
    .order("created_at", { ascending: false })
    .range(range[0], range[1]);

  console.log("Data sb:", data);
  return { data, error };
}

async function getBookSnippetByID(
  IDs: {
    bookID: string;
    coverID: string | null;
  }[]
) {
  try {
    const baseURL = openLibraryBaseURL;

    const booksPromises = IDs.map(async (item) => {
      const response = await fetch(baseURL + "works/" + item.bookID + ".json");
      const book = await response.json();

      //use coverID from the db if it exists, otherwise use the first cover from the API
      const coverID = item.coverID
        ? item.coverID
        : book.covers
        ? book.covers[0]
        : (null as string | null);

      return {
        title: book.title,
        key: book.key,
        authors: book.authors.map((author: any) => author.author.key),
        cover: coverID,
      } as BookSnippet;
    });

    const books = await Promise.all(booksPromises);

    return books;
  } catch (error) {
    console.error("Error fetching book snippet:", error);
    throw error;
  }
}

// get the books on the shelf and then get the book info from the api
async function getBooksByIDClient(
  URLProfileID: string,
  shelfID: number,
  range: number[]
) {
  try {
    const { data, error } = await getBooksOnShelfClient(
      URLProfileID,
      shelfID,
      range
    );

    if (error) throw error;

    if (!data) return { data: null, error: null };

    const IDs = data.map((book) => {
      return {
        bookID: book.book_id,
        coverID: book.cover_id,
      };
    });

    const books = await getBookSnippetByID(IDs);

    return { data: books, error: null };
  } catch (error: any) {
    console.error("Error fetching books by ids:", error);

    if ("message" in error) return { data: null, error: error.message };
    else return { data: null, error };
  }
}
