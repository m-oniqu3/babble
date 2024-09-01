import Editions from "@/src/components/books/Editions";
import FirstEdition from "@/src/components/books/FirstEdition";
import BookRatings from "@/src/components/books/Ratings";
import Button from "@/src/components/Button";
import { EditionsResponse, OpenLibraryWork, Ratings } from "@/src/types/search";
import Image from "next/image";
import Link from "next/link";

type Props = {
  details: {
    book: OpenLibraryWork;
    authorDetails: string[];
    editions: EditionsResponse | undefined;
    ratings: Ratings | undefined;
  };
};

function BookDetails(props: Props) {
  const { book, authorDetails, editions, ratings } = props.details;

  const openLibraryCoverBaseURL = "https://covers.openlibrary.org/b/id/";
  const firstEdition = editions?.entries?.[0];

  // find the first edition with a cover
  const firstEditionWithCover = editions?.entries?.find(
    (edition) => edition.covers && edition.covers.length > 0
  );

  const firstEditionCoverImageURL = firstEditionWithCover
    ? `${openLibraryCoverBaseURL}${firstEditionWithCover.covers![0]}-L.jpg`
    : "";

  // book cover should be a positive number
  const originalBookCover =
    book.covers?.[0] && book.covers?.[0] > 0 ? book.covers[0] : null;

  const OGCoverImageURL = originalBookCover
    ? `${openLibraryCoverBaseURL}${originalBookCover}-L.jpg`
    : null;

  const coverImageURL = OGCoverImageURL ?? firstEditionCoverImageURL;

  // split subjects and remove duplicates and NYT genres
  const uniqueGenres =
    book.subjects
      ?.toString()
      .split(",")
      .reduce((acc, genre) => {
        if (
          genre.startsWith("nyt") ||
          genre.toLowerCase().startsWith("collection")
        )
          return acc;
        if (!acc.includes(genre)) acc.push(genre);

        return acc;
      }, [] as string[]) || [];

  const renderGenres = uniqueGenres.map((genre) => {
    return (
      <li
        className="text-sm capitalize underline-offset-2 cursor-pointer hover:underline"
        key={genre}
      >
        <Link href={`subject/${encodeURI(genre.toLowerCase())}`}>{genre}</Link>
      </li>
    );
  });

  // render a section of the book details
  function renderSection(heading: string, data?: string[]) {
    if (!data || data.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-[0.9rem] font-semibold">{heading}</h2>
        <ul className="flex flex-wrap gap-2">
          {data.map((item) => {
            return (
              <li key={item} className="text-sm capitalize">
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <div className="wrapper py-8 space-y-6 md:space-y-0 md:grid md:grid-cols-[300px,1fr] md:gap-8 md:items-start max-w-6xl mx-auto ">
      <figure className="flex flex-col items-center gap-3 ">
        <Image
          src={coverImageURL}
          alt={book.title}
          className="rounded-md w-32 h-48 object-cover bg-slate-100 sm:rounded-xl sm:w-48 sm:h-72 md:w-52 md:h-80 "
          width={200}
          height={300}
        />

        <figcaption className="text-center md:hidden">
          <h1 className="text-xl font-semibold sm:text-2xl ">{book.title}</h1>
          {authorDetails && (
            <p className="text-sm">{authorDetails?.join(", ")}</p>
          )}

          {ratings && <BookRatings ratings={ratings} />}
        </figcaption>

        <Button className=" bg-black w-32 sm:w-48 md:w-52 h-9 text-white hover:bg-zinc-700 transition-colors">
          Add to Shelf
        </Button>
      </figure>

      <div className="flex flex-col gap-3 w-full">
        {/* title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl">
            {book.title}
          </h1>

          {authorDetails && (
            <p className="text-sm sm:text-base md:text-xl">
              {authorDetails?.join(", ")}
            </p>
          )}

          {ratings && <BookRatings ratings={ratings} size={30} />}
        </div>

        {/* first sentence */}
        {book.first_sentence && (
          <p className="text-sm font-semibold">{book.first_sentence.value}</p>
        )}

        {/* description */}
        {book.description ? (
          //   whitespace-pre-wrap
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {typeof book.description === "string"
              ? book.description
              : book.description.value}
          </p>
        ) : (
          <p className="text-sm ">No description available.</p>
        )}

        {/* subjects */}
        {book.subjects && (
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-[0.9rem] font-semibold">Genres</h2>
            <ul className="flex flex-wrap gap-2">{renderGenres}</ul>
          </div>
        )}

        {/* subject places */}
        {renderSection("Places", book.subject_places)}

        {/* subject times */}
        {renderSection("Times", book.subject_times)}

        {/* subject people */}
        {renderSection("Characters", book.subject_people)}

        {/* first edition info */}
        {firstEdition && <FirstEdition edition={firstEdition} />}

        {/* editions */}
        {editions && editions?.size > 0 && <Editions editions={editions} />}
      </div>
    </div>
  );
}

export default BookDetails;
