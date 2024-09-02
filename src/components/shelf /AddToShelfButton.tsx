"use client";

import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";
import UserShelves from "@/src/components/shelf /UserShelves";
import { OpenLibraryWork } from "@/src/types/search";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = {
  book: OpenLibraryWork;
  authUserID: string | null;
};

function AddToShelfButton(props: Props) {
  const { book, authUserID } = props;
  const [openShelfModal, setOpenShelfModal] = useState(false);

  function handleClick() {
    console.log("authUserID", authUserID);
    if (!authUserID) {
      redirect("/login");
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
        Add to Shelf
      </Button>

      {openShelfModal && (
        <Modal close={closeModal}>
          <UserShelves close={closeModal} authUserID={authUserID} book={book} />
        </Modal>
      )}
    </div>
  );
}

export default AddToShelfButton;
