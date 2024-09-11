import { EditionsResponse, OpenLibraryWork, Ratings } from "@/src/types/search";

export async function getBookDetails(key: string) {
  try {
    if (!key) return null;

    const baseURL = "https://openlibrary.org/";

    const response = await fetch(baseURL + "works/" + key + ".json");
    const book = (await response.json()) as OpenLibraryWork;

    // get author details
    const authorBaseURL = "https://openlibrary.org/";
    const authorKeys = book.authors?.map((author) => author.author?.key) ?? [];

    const authorInfo = authorKeys.map(async (key) => {
      const response = await fetch(authorBaseURL + key + ".json");
      const data = (await response.json()) as { name: string };

      return data.name;
    });

    const editionInfo: Promise<EditionsResponse | undefined> = fetch(
      baseURL + "works/" + key + "/editions.json?limit=6"
    ).then((res) => res.json());

    const ratingsInfo: Promise<Ratings | undefined> = fetch(
      baseURL + "works/" + key + "/ratings.json"
    ).then((res) => res.json());

    // Promise.all for author & edition info & ratings
    const [authorDetails, editions, ratings] = await Promise.all([
      Promise.all(authorInfo),
      editionInfo,
      ratingsInfo,
    ]);

    return {
      book,
      authorDetails,
      editions,
      ratings,
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}
