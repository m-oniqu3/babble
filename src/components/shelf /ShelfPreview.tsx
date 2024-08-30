"use client";

import { EditIcon, TagIcon } from "@/src/components/icons";
import Modal from "@/src/components/Modal";
import EditShelf from "@/src/components/shelf /EditShelf";
import { Shelf } from "@/src/types/shelves";
import Image from "next/image";
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

  function closeEditShelfModal() {
    setOpenEditShelfModal(false);
  }

  function handleEditShelfModal() {
    setOpenEditShelfModal((state) => !state);
  }

  return (
    <>
      <figure
        onMouseEnter={() => setIsHovering((state) => !state)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ width: "14.75rem", height: "9.8rem" }}
        className="relative cursor-pointer"
      >
        {isAuthUser && isHovering && (
          <div className="flex gap-2 items-center absolute bottom-2 right-2">
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
        )}

        <Image
          src={
            shelf.cover ||
            `https://picsum.photos/seed/${shelf.name.length + 5}}400/300`
          }
          alt={shelf.name}
          className="h-full w-full object-cover rounded-xl"
          width={14.75 * 16}
          height={9.8 * 16}
        />
      </figure>

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
