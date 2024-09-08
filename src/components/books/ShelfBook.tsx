import AddToShelfButton from "@/src/components/shelf/AddToShelfButton";
import { OpenLibraryWork } from "@/src/types/search";
import { createClient } from "@/utils/supabase/server";

type Props = {
  className?: string | undefined;
  bookID: OpenLibraryWork["key"];
  coverID: number | undefined;
};

async function getShelvesForBook(userID: string | null, bookID: string) {
  if (!userID) return null;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_books")
    .select("shelf_id")
    .eq("user_id", userID)
    .eq("book_id", bookID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shelves for user", error);
    return null;
  }

  if (!data) return null;

  return data;
}

async function ShelfBook(props: Props) {
  const { className = "", bookID, coverID } = props;
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  const userID = data.user?.id ?? null;

  const shelvesForBook = await getShelvesForBook(userID, bookID);

  return (
    <div className={` ${className}`}>
      <AddToShelfButton
        bookID={bookID}
        authUserID={userID}
        shelvesForBook={shelvesForBook}
        coverID={coverID}
      />
    </div>
  );
}

export default ShelfBook;
