import BookSnippets from "@/src/components/books/BookSnippets";

type Props = {
  URLProfileID: string;
  shelfID: number;
  authUserID: string | null;
};

async function SavedBooksOnShelf(props: Props) {
  const { URLProfileID, shelfID, authUserID } = props;

  return (
    <div>
      <BookSnippets
        URLProfileID={URLProfileID}
        shelfID={shelfID}
        authUserID={authUserID}
      />
    </div>
  );
}

export default SavedBooksOnShelf;
