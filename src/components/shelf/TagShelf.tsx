import Container from "@/src/components/Container";
import { AddIcon, CloseIcon, LoadingIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { createTag } from "@/src/server-actions/createTag";
import { tagShelf } from "@/src/server-actions/tagShelf";
import { getTagsForShelf } from "@/src/utils/tags/getTagsForShelf";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  close: () => void;
  isAuthUser: boolean;
  shelfID: number;
  authUserID: string | null;

  URLProfileID: string;
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
  const { close, isAuthUser, authUserID, shelfID, URLProfileID } = props;
  const [selectedTags, setSelectedTags] = useState<{ [key: number]: string }>(
    {}
  );
  const [currentTagIDs, setCurrentTagIDsSet] = useState<Set<number>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 1000);
  const [isCreatingTag, startCreatingtagTransition] = useTransition();
  const [isTaggingShelf, startTaggingShelfTransition] = useTransition();

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

  const shelfTagsQuery = useQuery({
    queryKey: ["shelf-tags", shelfID, URLProfileID],
    queryFn: getTagsForShelf.bind(null, createClient(), shelfID, URLProfileID),
    enabled: isAuthUser,
  });

  useEffect(() => {
    if (shelfTagsQuery.data) {
      const tags = shelfTagsQuery.data.reduce((acc, tag) => {
        acc[tag.id] = tag.tag;
        return acc;
      }, {} as { [key: number]: string });
      setSelectedTags(tags);

      const currentTagIDs = new Set(shelfTagsQuery.data.map((tag) => tag.id));
      setCurrentTagIDsSet(currentTagIDs);
    }
  }, [shelfTagsQuery.data]);

  // were there any changes to the selected tags
  // are the IDs in the selected tags different from the current shelf IDs?
  const selectedTagsSet = new Set(
    Object.keys(selectedTags).map((key) => Number(key))
  );
  const tagSelectionChanged =
    selectedTagsSet.difference(currentTagIDs).size > 0 ||
    currentTagIDs.difference(selectedTagsSet).size > 0;

  // get the new tags to be added
  const tagsToAdd = Array.from(selectedTagsSet.difference(currentTagIDs));

  // get the tags to be removed
  const tagsToRemove = Array.from(currentTagIDs.difference(selectedTagsSet));

  const resultsIncludeSearchInput = results
    ?.map((entry: { id: number; tag: string }) => entry.tag)
    .includes(debouncedSearchTerm.trim().split(" ").join("-"));

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

  // handle the tagging of the shelf -- add and remove tags
  function handleSubmitTagShelf() {
    if (!authUserID || !shelfID || !isAuthUser) {
      toast.error("You must be logged in to tag a shelf.");
      return;
    }

    if (tagsToAdd.length === 0 && tagsToRemove.length === 0) {
      toast.error("Please select at least one tag.");
      return;
    }

    const formData = new FormData();

    formData.append("shelfID", shelfID.toString());
    formData.append("tagsToAdd", JSON.stringify(tagsToAdd));
    formData.append("tagsToRemove", JSON.stringify(tagsToRemove));
    formData.append("userID", authUserID);

    startTaggingShelfTransition(async () => {
      const { data, error } = await tagShelf(formData);

      if (error) {
        toast.error(error);
      }

      if (data) {
        toast.message("Success", {
          description: data,
        });

        //revalidate the tags for the shelf
        queryClient.invalidateQueries({
          queryKey: ["shelf-tags", shelfID, URLProfileID],
        });

        setSelectedTags({});
        setSearchInput("");
        close();
      }
    });
  }

  // handle the creation of a new tag and add it to the selected tags
  function handleSubmitNewTag() {
    if (!searchInput || isCreatingTag) return;
    if (searchInput.trim().length < 3) {
      toast.error(`Let's make sure the tag is at least 3 characters long.`);
      return;
    }

    startCreatingtagTransition(async () => {
      const formData = new FormData();
      formData.append("tag", debouncedSearchTerm.trim());

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
        {shelfTagsQuery.isLoading && (
          <div className="w-full flex items-center justify-center">
            <LoadingIcon className="size-7" />
          </div>
        )}

        {isCreatingTag && (
          <div className="top-0 z-10 left-0 absolute h-full w-full bg-black/60 rounded-lg flex items-center justify-center">
            <LoadingIcon className="size-7 text-white" />
          </div>
        )}

        <header className="relative mb-4">
          <h1 className="text-lg font-semibold">Tag Your Shelf</h1>
          <p className="text-xs font-light">
            Tag your shelf with tropes to help others discover it.
          </p>

          <button onClick={close} className="absolute top-0 right-0">
            <CloseIcon className="size-5" />
          </button>
        </header>

        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInput}
            className="bg-slate-100 font-light text-xs h-8 w-full rounded-md px-2 focus:outline-none placeholder:text-xs placeholder:font-light"
            placeholder="Search for a tag"
            maxLength={50}
          />

          {debouncedSearchTerm && (
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              onClick={() => setSearchInput("")}
            >
              <CloseIcon className="size-3" />
            </button>
          )}
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
            {/* loading */}
            {isLoading && (
              <div className="w-full flex items-center justify-center">
                <LoadingIcon className="size-5" />
              </div>
            )}

            {/* error */}
            {isError && (
              <p>
                {"message" in error
                  ? error.message
                  : "We could not fetch the tags."}
              </p>
            )}

            {/* no results */}
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

                  {/* button to add whatever was searched */}
                  {!resultsIncludeSearchInput &&
                    debouncedSearchTerm.trim().length > 2 && (
                      <button
                        onClick={handleSubmitNewTag}
                        className="w-fit bg-black text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                      >
                        #{debouncedSearchTerm.trim().split(" ").join("-")}
                        <span>
                          <AddIcon className="size-3 text-white" />
                        </span>
                      </button>
                    )}
                </ul>
              </>
            )}
          </div>
        )}
      </Container>

      {/* SELECTED TAGS */}

      {(tagSelectionChanged || !!currentTagIDs.size) && (
        <Container>
          <p className="text-xs pb-2">
            You have selected {selectedTagsSet.size}{" "}
            {selectedTagsSet.size === 1 ? "tag" : "tags"}.
          </p>

          <ul className="flex flex-wrap gap-2">
            {Object.entries(selectedTags).map(([key, value]) => (
              <li
                key={key}
                className="bg-slate-100 text-xs font-medium px-2 py-1 rounded-md cursor-pointer flex items-center gap-1"
                onClick={handleSelectedTags.bind(null, {
                  id: +key,
                  name: value,
                })}
              >
                #{value}
                <span>
                  <CloseIcon className="size-3" />
                </span>
              </li>
            ))}
            {tagSelectionChanged && (
              <button
                disabled={isTaggingShelf}
                onClick={handleSubmitTagShelf}
                className="bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-md cursor-pointer flex items-center gap-1"
              >
                {isTaggingShelf ? (
                  <>
                    <LoadingIcon className="size-3" /> Tagging Shelf
                  </>
                ) : (
                  "Tag Shelf"
                )}
              </button>
            )}
          </ul>
        </Container>
      )}
    </div>
  );
}

export default TagShelf;
