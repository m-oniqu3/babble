import { createClient } from "@/utils/supabase/server";

type Props = {
  URLProfileID: string;
  shelfID: number;
  authUserID: string | null;
};

async function getBooksOnShelf(URLProfileID: string, shelfID: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_books")
    .select("*")
    .eq("user_id", URLProfileID)
    .eq("shelf_id", shelfID)
    .order("created_at", { ascending: false })
    .range(0, 10);

  return { data, error };
}

async function getBooksByID(bookIDs: number[]) {}

async function SavedBooksOnShelf(props: Props) {
  const { URLProfileID, shelfID } = props;

  const { data, error } = await getBooksOnShelf(URLProfileID, shelfID);

  if (error) {
    if (error.message) return <p>{error.message}</p>;
    else return <p>There was an error fetching the books</p>;
  }

  if (!data)
    return (
      <p>It looks like you haven&apos;t saved any books to this shelf yet.</p>
    );

  return <div>{JSON.stringify(data)}</div>;
}

export default SavedBooksOnShelf;
