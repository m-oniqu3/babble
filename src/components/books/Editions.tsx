import { EditionsResponse } from "@/src/types/search";
import Image from "next/image";
import Link from "next/link";

type Props = {
  editions: EditionsResponse | undefined;
};

function Editions({ editions }: Props) {
  if (!editions) return null;

  //filter editions with no cover
  const editionsWithCover =
    editions?.entries?.filter(
      (edition) => edition.covers && edition.covers[0]
    ) ?? [];

  const renderEditions = editionsWithCover.map((edition) => {
    const openLibraryCoverBaseURL = "https://covers.openlibrary.org/b/id/";
    const coverImageURL =
      openLibraryCoverBaseURL + edition.covers![0] + "-L.jpg";

    const key = edition.key.split("/").pop();
    return (
      <Link
        href={`/book/${key}`}
        key={edition.key}
        className="relative w-[5rem] sm:w-[7rem]  "
      >
        <figure className="">
          <Image
            src={coverImageURL}
            className="w-[5rem] h-[7.5rem] object-cover rounded-md bg-slate-200 sm:w-[7rem] sm:h-[10.5rem] sm:rounded-lg"
            width={200}
            height={300}
            alt={edition.title}
          />
        </figure>

        <div className="mt-3 w-[5rem] sm:w-[7rem]  ">
          <p className="text-xs w-full whitespace-normal font-medium break-words line-clamp-2">
            {edition.publishers?.[0]}
          </p>
          <p className="text-xs pt-[2px]">{edition.publish_date}</p>
        </div>
      </Link>
    );
  });

  return (
    <div className="mt-4 flex flex-col gap-2 w-full">
      <h2 className="text-[0.9rem] font-semibold">More Editions</h2>

      {/* overflow scroll */}
      <div className="max-w-3xl gap-3 flex flex-wrap gap-y-6">
        {renderEditions}
      </div>
    </div>
  );
}

export default Editions;
