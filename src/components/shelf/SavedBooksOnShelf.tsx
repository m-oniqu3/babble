import { getBooksByID } from "@/src/app/utils/getBooksOnShelf";
import BookSnippets from "@/src/components/books/BookSnippets";

type Props = {
  URLProfileID: string;
  shelfID: number;
  authUserID: string | null;
};

const range: number[] = [0, 2];

async function SavedBooksOnShelf(props: Props) {
  const { URLProfileID, shelfID } = props;

  const { data, error } = await getBooksByID(URLProfileID, shelfID, range);

  if (error) {
    return <p>There was an error fetching the book {error}</p>;
  }

  if (!data || data.length === 0)
    return (
      <p>It looks like you haven&apos;t saved any books to this shelf yet.</p>
    );

  return (
    <div>
      <BookSnippets
        initialBooks={data}
        initialRange={range}
        URLProfileID={URLProfileID}
        shelfID={shelfID}
      />
    </div>
  );
}

export default SavedBooksOnShelf;
