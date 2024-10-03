"use client";

import {
  BookMarkIcon,
  EditIcon,
  PrivateIcon,
  TagIcon,
} from "@/src/components/icons";
import Modal from "@/src/components/Modal";
import EditShelf from "@/src/components/shelf/EditShelf";
import { Shelf } from "@/src/types/shelves";
import { formatDate } from "@/src/utils/formatDate";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  authUserID: string | null;
  isAuthUser: boolean;
  shelf: Shelf;
};

function ShelfPreview(props: Props) {
  const { isAuthUser, shelf, authUserID } = props;
  const [isHovering, setIsHovering] = useState(false);
  const [openEditShelfModal, setOpenEditShelfModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function closeEditShelfModal() {
    setOpenEditShelfModal(false);
  }

  function handleEditShelfModal() {
    setOpenEditShelfModal((state) => !state);
  }

  const encodedShelfName = encodeURIComponent(shelf.name);
  return (
    <>
      <div style={{ width: "14.75rem" }} className="relative">
        <figure
          onClick={() => router.push(`${pathname}/${encodedShelfName}`)}
          onMouseEnter={() => setIsHovering((state) => !state)}
          onMouseLeave={() => setIsHovering(false)}
          style={{ width: "14.75rem", height: "9.8rem" }}
          className="relative cursor-pointer"
        >
          {isAuthUser && isHovering && (
            <>
              {shelf.private && (
                <div className="bg-white/70 absolute top-2 right-2 rounded-full p-2 cursor-pointer transition-colors hover:bg-white">
                  <PrivateIcon className="size-4" />
                </div>
              )}

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex gap-2 items-center absolute bottom-2 right-2"
              >
                <div className="bg-white/70 rounded-full p-2 cursor-pointer transition-colors hover:bg-white">
                  <TagIcon className="size-4" />
                </div>

                <div
                  className="bg-white/70 rounded-full p-2 cursor-pointer transition-colors hover:bg-white"
                  onClick={handleEditShelfModal}
                >
                  <EditIcon className="size-4" />
                </div>
              </div>
            </>
          )}

          {shelf.cover ? (
            <Image
              src={
                shelf.cover
                // `https://picsum.photos/seed/${shelf.name.length + 5}}400/300`
              }
              alt={shelf.name}
              className="h-full w-full object-cover rounded-xl"
              width={14.75 * 16}
              height={9.8 * 16}
            />
          ) : (
            <div className="h-full w-full bg-slate-100 rounded-xl"></div>
          )}
        </figure>

        <div className="py-2 w-full">
          <div className="grid grid-cols-[1fr,40px] items-center gap-1">
            <h2 className="font-semibold text-lg line-clamp-1 w-full">
              {shelf.name}
            </h2>

            <div className="ml-auto cursor-pointer">
              <BookMarkIcon className="size-5 text-slate-200 hover:text-slate-600 transition-colors" />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xs">
              {!shelf.book_count
                ? "0 books"
                : shelf.book_count > 1
                ? `${shelf.book_count} books`
                : `${shelf.book_count} book`}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(new Date(shelf.created_at))}
            </p>
          </div>
        </div>
      </div>

      {/* only show edit modal if user is the owner of the shelf */}
      {openEditShelfModal && isAuthUser && (
        <Modal close={closeEditShelfModal}>
          <EditShelf
            close={closeEditShelfModal}
            isAuthUser={isAuthUser}
            authUserID={authUserID}
            shelfID={shelf.id}
          />
        </Modal>
      )}
    </>
  );
}

export default ShelfPreview;
