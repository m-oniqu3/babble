"use client";

import { EditIcon } from "@/src/components/icons";
import Modal from "@/src/components/Modal";
import EditShelf from "@/src/components/shelf/EditShelf";
import { useState } from "react";

type Props = {
  authUserID: string | null;
  isAuthUser: boolean;
  shelfID: number;
};

function EditShelfOptions(props: Props) {
  const { isAuthUser, authUserID, shelfID } = props;

  const [openEditShelfModal, setOpenEditShelfModal] = useState(false);

  function closeEditShelfModal() {
    setOpenEditShelfModal(false);
  }

  function handleEditShelfModal() {
    setOpenEditShelfModal((state) => !state);
  }

  return (
    <>
      <div
        onClick={handleEditShelfModal}
        className="w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-200 transition-colors "
      >
        <EditIcon className="size-4 " />
      </div>

      {openEditShelfModal && isAuthUser && (
        <Modal close={closeEditShelfModal}>
          <EditShelf
            close={closeEditShelfModal}
            isAuthUser={isAuthUser}
            authUserID={authUserID}
            shelfID={shelfID}
          />
        </Modal>
      )}
    </>
  );
}

export default EditShelfOptions;
