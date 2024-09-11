import { openLibraryBaseURL } from "@/src/app/utils/openLibrary";
import { BookSnippet } from "@/src/types/books";
import { createClient } from "@/utils/supabase/server";

export async function getBooksOnShelf(
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

  return { data, error };
}

export async function getBookSnippetByID(
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
export async function getBooksByID(
  URLProfileID: string,
  shelfID: number,
  range: number[]
) {
  try {
    const { data, error } = await getBooksOnShelf(URLProfileID, shelfID, range);

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
