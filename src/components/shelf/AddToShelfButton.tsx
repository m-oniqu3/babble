"use client";

import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";
import UserShelves from "@/src/components/shelf /UserShelves";
import { OpenLibraryWork } from "@/src/types/search";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = {
  bookID: OpenLibraryWork["key"];
  authUserID: string | null;
  shelvesForBook: { shelf_id: number }[] | null;
};

function AddToShelfButton(props: Props) {
  const { bookID, authUserID, shelvesForBook } = props;
  const [openShelfModal, setOpenShelfModal] = useState(false);

  function handleClick() {
    if (!authUserID) {
      return redirect("/login");
    }

    setOpenShelfModal((state) => !state);
  }

  function closeModal() {
    setOpenShelfModal(false);
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        className=" bg-black w-32 sm:w-48 md:w-52 h-9 text-white hover:bg-zinc-700 transition-colors"
      >
        {!shelvesForBook || shelvesForBook?.length === 0
          ? "Add to Shelf"
          : "Saved"}
      </Button>

      {openShelfModal && (
        <Modal close={closeModal}>
          <UserShelves
            close={closeModal}
            authUserID={authUserID}
            bookID={bookID}
            shelvesForBook={shelvesForBook}
          />
        </Modal>
      )}
    </div>
  );
}

export default AddToShelfButton;
