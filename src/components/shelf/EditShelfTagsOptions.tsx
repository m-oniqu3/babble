"use client";

import { TagIcon } from "@/src/components/icons";
import Modal from "@/src/components/Modal";
import TagShelf from "@/src/components/shelf/TagShelf";
import { useState } from "react";

type Props = {
  shelfID: number;
  isAuthUser: boolean;
  authUserID: string | null;
  URLProfileID: string;
};

function EditShelfTagsOptions(props: Props) {
  const { shelfID, isAuthUser, authUserID, URLProfileID } = props;

  const [openTagModal, setOpenTagModal] = useState(false);

  function closeTagModal() {
    setOpenTagModal(false);
  }

  function handleTagModal() {
    setOpenTagModal((state) => !state);
  }

  return (
    <>
      <div
        onClick={handleTagModal}
        className="w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-200 transition-colors"
      >
        <TagIcon className="size-4" />
      </div>

      {openTagModal && isAuthUser && (
        <Modal close={closeTagModal}>
          <TagShelf
            close={closeTagModal}
            shelfID={shelfID}
            isAuthUser={isAuthUser}
            authUserID={authUserID}
            URLProfileID={URLProfileID}
          />
        </Modal>
      )}
    </>
  );
}

export default EditShelfTagsOptions;
