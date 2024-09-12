import { BookSnippet } from "@/src/types/books";
import { openLibraryBaseURL } from "@/src/utils/openLibrary";
import { getRange } from "@/src/utils/paginate";
import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 *
 * @description Get the books on the given shelf for the given user
 * @returns Data - Array of books on the shelf | Error - Error message
 */
async function getBooksOnShelf(
  client: SupabaseClient<Database>,
  URLProfileID: string,
  shelfID: number,
  page: number
) {
  const range = getRange(page, 10);

  const { data, error } = await client
    .from("saved_books")
    .select("*")
    .eq("user_id", URLProfileID)
    .eq("shelf_id", shelfID)
    .order("created_at", { ascending: false })
    .range(range[0], range[1]);

  return { data, error };
}

/**
 *
 * @description Get the book snippet by the given IDs
 * @returns Array of BookSnippet
 */
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

/**
 *
 * @description Get the books on the shelf and then get the book info from the api
 * @returns Array of BookSnippet
 *
 */
export async function getBooksByID(
  client: SupabaseClient<Database>,
  URLProfileID: string,
  shelfID: number,
  page: number
) {
  try {
    const { data, error } = await getBooksOnShelf(
      client,
      URLProfileID,
      shelfID,
      page
    );

    if (error) throw error;

    if (!data) return [];

    const IDs = data.map((book) => {
      return {
        bookID: book.book_id,
        coverID: book.cover_id,
      };
    });

    const books = await getBookSnippetByID(IDs);
    return books;
  } catch (error: any) {
    console.error("Error fetching books by ids:", error);

    if ("message" in error) throw error.message;
    else throw error;
  }
}
