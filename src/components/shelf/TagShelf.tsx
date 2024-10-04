import Container from "@/src/components/Container";
import { AddIcon, CloseIcon, LoadingIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { createTag } from "@/src/server-actions/createTag";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  close: () => void;
};

const initialTags = [
  { id: 1, name: "romance" },
  { id: 2, name: "spicy" },
  { id: 4, name: "one-bed" },
  { id: 5, name: "enemies-to-lovers" },
  { id: 6, name: "he-fell-first" },
  { id: 7, name: "mafia" },
  { id: 8, name: "dark-romance" },
  { id: 10, name: "slow-burn" },
  { id: 12, name: "forbidden-love" },
  { id: 13, name: "heartbreak" },
];

async function findTags(searchInput: string) {
  try {
    const supabase = createClient();
    const sanitizedSearchInput = searchInput
      .trim()
      .toLowerCase()
      .split(" ")
      .join("-");

    const { data, error } = await supabase
      .from("tags")
      .select("id, tag")
      .ilike("tag", `%${sanitizedSearchInput}%`)
      .limit(10);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Could not fetch the tags", error);
    throw error;
  }
}

function TagShelf(props: Props) {
  const { close } = props;
  const [selectedTags, setSelectedTags] = useState<{ [key: number]: string }>(
    {}
  );
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 1000);
  const [isCreatingTag, startCreatingtagTransition] = useTransition();

  const queryClient = useQueryClient();
  const {
    data: results,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tags", debouncedSearchTerm],
    queryFn: () => findTags(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
  });

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  // update the selected tags
  function handleSelectedTags(tag: { id: number; name: string }) {
    setSelectedTags((prev) => {
      const localSelectedTags = Object.assign({}, prev);

      if (localSelectedTags[tag.id]) {
        delete localSelectedTags[tag.id];
      } else {
        localSelectedTags[tag.id] = tag.name;
      }

      return localSelectedTags;
    });
  }

  function handleSubmitNewTag() {
    if (!searchInput || isCreatingTag) return;
    if (searchInput.trim().length < 3) {
      toast.error(`Let's make sure the tag is at least 3 characters long.`);
      return;
    }

    startCreatingtagTransition(async () => {
      const formData = new FormData();
      formData.append("tag", debouncedSearchTerm);

      const { data, error } = await createTag(formData);

      if (error) {
        toast.error(error);
      }

      if (data) {
        handleSelectedTags({ id: data.id, name: data.tag });

        // invalidate the query so the new tag shows up
        queryClient.invalidateQueries({
          queryKey: ["tags", debouncedSearchTerm],
        });

        setSearchInput("");

        toast.message("Success", {
          description: `You've created the tag ${data.tag}`,
        });
      }
    });
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 w-full "
      onClick={(e) => e.stopPropagation()}
    >
      <Container className="relative h-full">
        {isCreatingTag && (
          <div className="top-0 left-0 absolute h-full w-full bg-black/60 rounded-lg flex items-center justify-center">
            <LoadingIcon className="size-7 text-white" />
          </div>
        )}
        <header className="relative mb-4">
          <h1 className="text-lg font-semibold">Tag Your Shelf</h1>
          <p className="text-xs font-light">
            Tag your shelf with tropes to help others discover it.
          </p>

          <button onClick={close} className="absolute top-0 right-0">
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInput}
            className="bg-slate-100 font-light text-xs h-8 w-full rounded-md px-2 focus:outline-none placeholder:text-xs placeholder:font-light"
            placeholder="romance"
            maxLength={50}
          />
        </form>

        {/* intial tags - only show when there is no search input */}
        {!debouncedSearchTerm && (
          <div className="">
            <p className="my-4 text-xs">
              Here are some tags to get you started.
            </p>

            <ul className="flex flex-wrap gap-2">
              {initialTags.map((tag) => (
                <li
                  key={tag.id}
                  className="bg-slate-100 text-xs font-medium px-2 py-1 rounded-md cursor-pointer"
                  onClick={handleSelectedTags.bind(null, tag)}
                >
                  #{tag.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* search results */}
        {debouncedSearchTerm && (
          <div className="mt-4 min-h-16">
            {isLoading && (
              <div className="w-full flex items-center justify-center">
                <LoadingIcon className="size-5" />
              </div>
            )}

            {isError && (
              <p>
                {"message" in error
                  ? error.message
                  : "We could not fetch the tags."}
              </p>
            )}

            {!isLoading && !isError && results && results.length === 0 && (
              <div className="">
                <p className="text-xs pb-2">
                  {`Looks like our readers haven't tagged this yet. Be the first to tag it!`}
                </p>

                <button
                  disabled={isCreatingTag}
                  onClick={handleSubmitNewTag}
                  className="w-fit bg-slate-100 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                >
                  #{debouncedSearchTerm.trim().split(" ").join("-")}
                  <span>
                    <AddIcon className="size-3" />
                  </span>
                </button>
              </div>
            )}

            {results && results.length > 0 && (
              <>
                <p className="text-xs font-light pb-2">{`Here's what we found.`}</p>

                <ul className="flex flex-wrap gap-2">
                  {results.map((entry: { id: number; tag: string }) => (
                    <li
                      key={entry.id}
                      className="bg-slate-100 text-xs font-medium px-2 py-1 rounded-md cursor-pointer"
                      onClick={handleSelectedTags.bind(null, {
                        id: entry.id,
                        name: entry.tag,
                      })}
                    >
                      #{entry.tag}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Container>

      {Object.keys(selectedTags).length > 0 && (
        <Container>
          <p className="text-xs pb-2">
            You have selected {Object.keys(selectedTags).length}{" "}
            {Object.keys(selectedTags).length > 1 ? "tags" : "tag"}.
          </p>

          <ul className="flex flex-wrap gap-2">
            {Object.entries(selectedTags).map(([key, value]) => (
              <li
                key={key}
                className="bg-slate-100 text-xs font-medium px-2 py-1 rounded-md cursor-pointer flex items-center gap-1"
              >
                #{value}
                <span
                  onClick={handleSelectedTags.bind(null, {
                    id: +key,
                    name: value,
                  })}
                >
                  <CloseIcon className="size-3" />
                </span>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </div>
  );
}

export default TagShelf;
