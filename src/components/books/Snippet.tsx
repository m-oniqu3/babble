"use client";

import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";
import UserShelves from "@/src/components/shelf/UserShelves";
import { BookSnippet } from "@/src/types/books";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  book: BookSnippet;
  URLProfileID: string;
  authUserID: string | null;
};

async function getShelvesForBookID(userID: string | null, bookID: string) {
  if (!userID) return;
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

  if (!data) return;

  return data;
}

function Snippet(props: Props) {
  const { book, authUserID, URLProfileID } = props;
  const [isHovering, setIsHovering] = useState(false);
  const [openShelfModal, setOpenShelfModal] = useState(false);
  const [shelvesForBook, setShelvesForBook] = useState<
    { shelf_id: number }[] | null
  >(null);
  const router = useRouter();

  const bookID = book.key.split("/").pop() as string;
  const queryClient = useQueryClient();

  function handleMouseEnter() {
    if (!authUserID || URLProfileID !== authUserID) {
      return setIsHovering(false);
    }

    setIsHovering(true);

    // Prefetch the shelves when hovering
    queryClient.prefetchQuery({
      queryKey: ["shelves", authUserID, bookID],
      queryFn: () => getShelvesForBookID(authUserID, bookID),
    });
  }

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["shelves", authUserID, bookID],
    queryFn: () => getShelvesForBookID(authUserID, bookID),
    enabled: false,
  });

  async function handleShelve() {
    if (!authUserID) return;

    if (!data) {
      const result = await refetch(); // Refetch if needed
      setShelvesForBook(result.data || []);
    } else {
      setShelvesForBook(data); // Use cached prefetched data
    }

    setOpenShelfModal(true);
  }

  function closeModal() {
    setOpenShelfModal(false);
  }

  return (
    <>
      <li
        className="relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => router.push(`/book/${bookID}`)}
      >
        <figure>
          {isHovering && (
            <figcaption className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-lg md:rounded-xl">
              <div
                className="flex justify-end items-center w-full p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  className="bg-white px-4 rounded-lg hover:bg-slate-200 transition-colors"
                  onClick={handleShelve}
                  disabled={isLoading}
                >
                  Shelve
                </Button>
              </div>
            </figcaption>
          )}

          {book.cover && (
            <Image
              src={`https://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
              alt={`Cover of ${book.title}`}
              width={300}
              height={350}
              className="bg-slate-200 object-cover rounded-xl  cover"
            />
          )}

          {!book.cover && <div className="bg-slate-200 cover"></div>}
        </figure>
      </li>

      {openShelfModal && (
        <Modal close={closeModal}>
          <UserShelves
            close={closeModal}
            authUserID={authUserID}
            bookID={bookID}
            shelvesForBook={shelvesForBook}
            coverID={book?.cover ? parseInt(book.cover) : undefined}
          />
        </Modal>
      )}
    </>
  );
}

export default Snippet;
