import BookSnippets from "@/src/components/books/BookSnippets";
import { getBooksByID } from "@/src/utils/getBooksOnShelf";
import { createClient } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  URLProfileID: string;
  shelfID: number;
  authUserID: string | null;
};

async function SavedBooksOnShelf(props: Props) {
  const { URLProfileID, shelfID, authUserID } = props;

  const queryClient = new QueryClient();
  const supabase = createClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["book-snippets", URLProfileID, shelfID],
    queryFn: ({ pageParam }) =>
      getBooksByID(supabase, URLProfileID, shelfID, pageParam),

    initialPageParam: 0,
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookSnippets
          URLProfileID={URLProfileID}
          shelfID={shelfID}
          authUserID={authUserID}
        />
      </HydrationBoundary>
    </div>
  );
}

export default SavedBooksOnShelf;
