import Button from "@/src/components/Button";
import Container from "@/src/components/Container";
import {
  AddCircleOutline,
  AddCircleSolid,
  AddIcon,
  LoadingIcon,
  SearchIcon,
} from "@/src/components/icons";
import { OpenLibraryWork } from "@/src/types/search";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  close: () => void;
  authUserID: string | null;
  book: OpenLibraryWork;
};

async function getUserShelves(authUserID: string | null) {
  if (!authUserID) {
    return { data: null, error: "User not authenticated" };
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("shelves")
    .select("id, name,cover,user_id")
    .eq("user_id", authUserID)
    .order("created_at", { ascending: false });

  return {
    data,
    error,
  };
}

function UserShelves(props: Props) {
  const { authUserID, close } = props;

  const {
    isLoading,
    error,
    data: result,
  } = useSWR("user-shelves", getUserShelves.bind(null, authUserID));

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShelves, setFilteredShelves] = useState(result?.data);
  const [selectedShelvesIDs, setSelectedShelvesIDs] = useState<Set<number>>(
    new Set()
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);

    if (!result?.data) return;

    if (e.target.value === "") {
      setFilteredShelves(result.data);
      return;
    }

    // filter shelves
    const filtered = result?.data?.filter((shelf) =>
      shelf.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredShelves(filtered);
  }

  function handleShelfSelection(shelfID: number) {
    setSelectedShelvesIDs((prev) => {
      // create a new set from the previous one
      const newSet = new Set(prev);

      // if the shelf is already selected, remove it
      if (newSet.has(shelfID)) {
        newSet.delete(shelfID);
      } else {
        newSet.add(shelfID);
      }

      return new Set(newSet);
    });
  }

  //when data is available, update the filteredShelves state
  useEffect(() => {
    if (result?.data) {
      setFilteredShelves(result.data);
    }
  }, [result?.data]);

  const renderShelves = filteredShelves?.map((shelf) => {
    const isSelected = selectedShelvesIDs.has(shelf.id);

    return (
      <li
        key={shelf.id}
        className="grid grid-cols-[40px,1fr,32px] gap-4 h-10 items-center"
      >
        {shelf.cover && (
          <Image
            src={shelf.cover}
            alt={shelf.name}
            width={40}
            height={40}
            quality={100}
            priority
            unoptimized
            className="rounded-md size-10 object-cover bg-slate-100"
          />
        )}

        {!shelf.cover && (
          <div className="rounded-md size-10 bg-slate-100"></div>
        )}

        <p className="text-sm font-medium line-clamp-1">{shelf.name}</p>

        {!isSelected ? (
          <div
            className="cursor-pointer"
            onClick={handleShelfSelection.bind(null, shelf.id)}
          >
            <AddCircleOutline className="size-5 text-zinc-400" />
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={handleShelfSelection.bind(null, shelf.id)}
          >
            <AddCircleSolid className="size-5 text-black" />
          </div>
        )}
      </li>
    );
  });

  return (
    <Container className="p-0 h-[27rem] max-w-sm relative">
      <header className="flex flex-col gap-1 border-b border-slate-100 p-4 pb-2">
        <h2 className="text-xs font-semibold">Add to Shelf</h2>

        <form className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="bg-slate-100 font-light text-xs h-8 w-full rounded-md px-2 pr-8 focus:outline-none placeholder:text-xs placeholder:font-light"
            placeholder="Find a shelf"
          />

          <div>
            <SearchIcon className="w-4 h-4 text-slate-300 absolute top-1/2 right-2 transform -translate-y-1/2" />
          </div>
        </form>

        <Button className="flex items-center gap-2 text-[0.8rem] px-0 mt-1 font-normal">
          <AddIcon className="w-4 h-4" />
          <span>Create Shelf</span>
        </Button>
      </header>

      {isLoading && (
        <p className="text-sm flex items-center justify-between gap-1 p-4">
          <span>Getting your shelves...</span>
          <span className="animate-spin">
            <LoadingIcon className="size-5" />
          </span>
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 p-4">
          We&apos;re sorry but we&apos;re having trouble fetching your shelves.
          Please try again later{" "}
        </p>
      )}

      {result?.data?.length === 0 && (
        <p className="text-sm p-4">
          It looks like you don&apos;t have any shelves yet.
        </p>
      )}

      {filteredShelves?.length === 0 && (
        <p className="text-sm p-4">No shelves found.</p>
      )}

      <ul className="space-y-2 mt-2 h-60 overflow-y-auto p-4">
        {renderShelves}
      </ul>

      <footer className="flex justify-end p-4 border-t-[1px] border-slate-100 absolute bottom-0 w-full">
        <Button onClick={close} className="text-xs">
          Cancel
        </Button>
      </footer>
    </Container>
  );
}

export default UserShelves;
