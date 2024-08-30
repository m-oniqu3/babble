"use client";

import { CloseIcon, SearchIcon } from "@/src/components/icons";
import { useEffect, useState } from "react";

function Search() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //close mobile search automatically when media query changes to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 640) {
        setShowMobileSearch(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <div className="">
      <div
        onClick={() => setShowMobileSearch((state) => !state)}
        className="flex items-center gap-3 text-sm px-2 h-8 cursor-pointer rounded-md hover:bg-gray-200 sm:hidden"
      >
        <SearchIcon className="size-5 " />
      </div>

      <form className="hidden sm:grid items-center gap-2 w-72">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTerm}
          placeholder="Search Books"
          className="bg-slate-100  text-[0.8rem] h-8 w-full rounded-md px-2 focus:outline-none placeholder:text-[0.8rem]"
        />
      </form>

      {showMobileSearch && (
        <div className="absolute top-0 left-0 w-full bg-white px-4 h-16 flex items-center justify-center gap-4 border-b-[1px] border-slate-200">
          <form className="w-4/5 ">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTerm}
              placeholder="Search Books"
              className="bg-slate-100 w-full text-[0.8rem] h-8 rounded-md px-2 focus:outline-none placeholder:text-[0.8rem]"
            />
          </form>

          <div
            className="cursor-pointer"
            onClick={() => setShowMobileSearch(false)}
          >
            <CloseIcon className="size-5" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
