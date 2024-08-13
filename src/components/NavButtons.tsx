"use client";

import ButtonLink from "@/src/components/ButtonLink";
import { AddIcon, SearchIcon } from "@/src/components/icons";
import Modal from "@/src/components/Modal";
import ProfileAvatar from "@/src/components/profile/ProfileAvatar";
import CreateShelf from "@/src/components/shelf /CreateShelf";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  isLoggedIn: boolean;
};

function NavButtons({ isLoggedIn }: Props) {
  const pathname = usePathname();
  const [openCreateShelfModal, setOpenCreateShelfModal] = useState(false);

  function handleCreateShelfModal() {
    setOpenCreateShelfModal((state) => !state);
  }

  return (
    <>
      {pathname !== "/login" && (
        <>
          {!isLoggedIn && (
            <div className="flex items-center gap-3 ml-auto ">
              <SearchIcon className="w-6 h-6" />

              <ButtonLink route="/login" className="bg-black text-white ">
                Sign in
              </ButtonLink>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-3 ml-auto">
              <p
                onClick={handleCreateShelfModal}
                className="flex items-center gap-3 text-sm px-2 h-8 cursor-pointer hover:bg-gray-200"
              >
                <AddIcon className="w-5 h-5" />
                Create
              </p>
              <ProfileAvatar />
            </div>
          )}
        </>
      )}

      {openCreateShelfModal && (
        <Modal close={() => setOpenCreateShelfModal(false)}>
          <CreateShelf close={() => setOpenCreateShelfModal(false)} />
        </Modal>
      )}
    </>
  );
}

export default NavButtons;
