import Container from "@/src/components/Container";
import { LoadingIcon } from "@/src/components/icons";
import useDetectClickOutside from "@/src/hooks/useDetectClickOutside";
import { SearchResponse } from "@/src/types/search";
import Image from "next/image";
import Link from "next/link";

type Props = {
  searchTerm: string;
  result: {
    isLoading: boolean;
    error: any;
    data: SearchResponse | undefined;
  };
  className?: string;
  closeDropdown: () => void;
  style?: React.CSSProperties;
};

function SearchDropdown(props: Props) {
  const {
    searchTerm,
    result: { isLoading, error, data },
    className = "",
    closeDropdown,
    style = {},
  } = props;

  const dropdownRef = useDetectClickOutside<HTMLDivElement>({
    closeMenu: closeDropdown,
  });

  const openLibraryCoverBaseURL = "https://covers.openlibrary.org/b/id/";
  const openLibraryISBNBaseURL = "https://covers.openlibrary.org/b/isbn/";
  const noData =
    (!isLoading && error && !data) ||
    (!isLoading && error && data && data.numFound === 0);

  function renderLoadingContent() {
    return (
      <header className="text-sm  p-2">
        <p className="text-sm flex items-center justify-between">
          Search Results for {searchTerm}
          <span className="animate-spin">
            <LoadingIcon className="size-5" />
          </span>
        </p>
      </header>
    );
  }

  function renderErrorContent() {
    return (
      <header className="text-sm  p-2">
        <p className="text-sm flex items-center justify-between">
          Search Results for {searchTerm}
          <span className="text-red-500">Error fetching data</span>
        </p>
      </header>
    );
  }

  const renderDropdownItem = data?.docs.map((book) => {
    const coverImageURL = book.cover_i
      ? `${openLibraryCoverBaseURL}${book.cover_i}-M.jpg`
      : `${openLibraryISBNBaseURL}${book?.isbn?.[0]}-M.jpg`;

    return (
      <li key={book.key}>
        <Link
          href={`/book/${book.key.split("/").pop()}`}
          className="grid grid-cols-[50px,1fr] gap-4 px-2 pt-2 border-b-[1px] cursor-pointer border-slate-200 hover:bg-slate-50"
        >
          <Image
            src={coverImageURL}
            alt={book.title}
            className="size-12 object-cover rounded-t-sm bg-slate-100"
            width={50}
            height={50}
          />
          <div>
            <h3 className="text-sm font-medium line-clamp-1">{book.title}</h3>
            {book.author_name && (
              <p className="text-xs line-clamp-1">{book.author_name[0]}</p>
            )}
          </div>
        </Link>
      </li>
    );
  });

  return (
    <div className={className} ref={dropdownRef} style={style}>
      <Container
        className="w-full border border-slate-200 p-0! mx-0 "
        style={{ padding: "0" }}
      >
        {isLoading && renderLoadingContent()}
        {!isLoading && error && renderErrorContent()}

        {/* no data */}
        {noData && (
          <p className="text-sm p-2">No results found for {searchTerm}</p>
        )}

        {data && (
          <>
            <ul> {renderDropdownItem} </ul>

            <footer className="p-2">
              <p className="text-xs text-center line-clamp-2">
                Show all results for {searchTerm}
              </p>
            </footer>
          </>
        )}
      </Container>
    </div>
  );
}

export default SearchDropdown;
