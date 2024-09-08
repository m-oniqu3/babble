"use client";

import ButtonLink from "@/src/components/ButtonLink";
import { AddIcon, SearchIcon } from "@/src/components/icons";
import Modal from "@/src/components/Modal";
import ProfileAvatar from "@/src/components/profile/ProfileAvatar";
import Search from "@/src/components/search/Search";
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
    <div className=" flex gap-2 items-center">
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

          <Search />

          {isLoggedIn && (
            <div className="flex items-center gap-3 ml-auto">
              <p
                onClick={handleCreateShelfModal}
                className="flex items-center gap-3 text-sm  px-2 h-8 cursor-pointer rounded-md hover:bg-slate-100"
              >
                <AddIcon className="w-5 h-5" />
                <span className="hidden xl:block">Create</span>
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
    </div>
  );
}

export default NavButtons;
