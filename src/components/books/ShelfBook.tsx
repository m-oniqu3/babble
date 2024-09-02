import AddToShelfButton from "@/src/components/shelf /AddToShelfButton";
import { OpenLibraryWork } from "@/src/types/search";
import { createClient } from "@/utils/supabase/server";

type Props = {
  className?: string | undefined;
  book: OpenLibraryWork;
};

async function ShelfBook(props: Props) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const userID = data.user?.id ?? null;

  const { className = "", book } = props;

  return (
    <div className={` ${className}`}>
      <AddToShelfButton book={book} authUserID={userID} />
    </div>
  );
}

export default ShelfBook;
