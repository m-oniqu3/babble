"use client";

import { CloseIcon, SearchIcon } from "@/src/components/icons";
import SearchDropdown from "@/src/components/search/SearchDropdown";
import useDebounce from "@/src/hooks/useDebounce";

import { useEffect, useState } from "react";
import useSWR from "swr";

// fn to search books from open library
async function searchBooks(query: string) {
  if (!query) return;

  const baseURL = "https://openlibrary.org/search.json?q=";

  //limit search to 5 results
  const response = await fetch(`${baseURL}${query}&limit=5`);
  const data = await response.json();

  const result = {
    numFound: data.numFound,
    start: data.start,
    numFoundExact: data.numFoundExact,
    docs: data.docs.map((doc: any) => ({
      title: doc.title,
      author_name: doc.author_name,
      key: doc.key,
      cover_i: doc.cover_i,
      isbn: doc.isbn,
      first_publish_year: doc.first_publish_year,
      publish_date: doc.publish_date,
    })),
  };

  return result;
}

function Search() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [showDropdown, setShowDropdown] = useState(false);

  //prevent scroll when mobile search is open
  useEffect(() => {
    if (showMobileSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showMobileSearch]);

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

  const { isLoading, data, error } = useSWR(
    `$search-${debouncedSearchTerm}`,
    searchBooks.bind(null, debouncedSearchTerm)
  );

  // show dropdown when search term is not empty
  useEffect(() => {
    if (searchTerm) setShowDropdown(true);
    else setShowDropdown(false);
  }, [searchTerm]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!searchTerm) {
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
  }

  function resumeSearch() {
    if (searchTerm) setShowDropdown(true);
  }

  return (
    <div className="relative">
      <div
        onClick={() => setShowMobileSearch((state) => !state)}
        className="flex items-center gap-3 text-sm px-2 h-8 cursor-pointer rounded-md hover:bg-gray-200 sm:hidden"
      >
        <SearchIcon className="size-5 " />
      </div>
      {!showMobileSearch && (
        <div className="relative">
          <form
            className="hidden sm:grid items-center gap-2 w-72 relative"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={searchTerm}
              onClick={resumeSearch}
              onChange={handleSearchTerm}
              placeholder="Search Books"
              className="bg-slate-100 text-[0.8rem] h-8 w-full rounded-md px-2 focus:outline-none placeholder:text-[0.8rem]"
            />

            {showDropdown && (
              <SearchDropdown
                className="hidden sm:block w-72 absolute top-10 left-0 z-40"
                searchTerm={searchTerm}
                result={{ isLoading, error, data }}
                closeDropdown={() => setShowDropdown(false)}
              />
            )}
          </form>
        </div>
      )}

      {showMobileSearch && (
        <div className=" h-screen bg-white/50 fixed top-0 left-0 z-40 w-full ">
          <div className="  bg-white px-4 h-16 flex items-center justify-center gap-4 border-b-[1px] border-slate-200">
            <form className="w-96 relative" onSubmit={handleSubmit}>
              <input
                type="text"
                value={searchTerm}
                onClick={resumeSearch}
                onChange={handleSearchTerm}
                placeholder="Search Books"
                className="bg-slate-100 w-full text-[0.8rem] h-8 rounded-md px-2 focus:outline-none placeholder:text-[0.8rem]"
              />

              {showDropdown && (
                <SearchDropdown
                  className="z-40 max-w-96 absolute top-16 left-0"
                  searchTerm={searchTerm}
                  result={{ isLoading, error, data }}
                  closeDropdown={() => setShowDropdown(false)}
                />
              )}
            </form>

            <div
              className="cursor-pointer"
              onClick={() => setShowMobileSearch(false)}
            >
              <CloseIcon className="size-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
