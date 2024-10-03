import { OpenLibrarySubject } from "@/src/types/search";
import { openLibrarySubjectsBaseURL } from "@/src/utils/openLibrary";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { genre: string };
};

async function getSubjects(genre: string) {
  if (!genre) return;

  const response = await fetch(
    openLibrarySubjectsBaseURL + genre + ".json?details=true&limit=50"
  );

  if (!response.ok || !response.json) {
    return null;
  }
  const data = await response.json();

  return data as OpenLibrarySubject;
}

async function SubjectPage({ params }: Props) {
  if (!params.genre) {
    return <div>Subject is required</div>;
  }

  const subjectData = await getSubjects(decodeURIComponent(params.genre));

  if (!subjectData) {
    return <div>Could not find any data for {params.genre}</div>;
  }

  const renderedWorks = subjectData.works
    ?.filter((work) => work.cover_id)
    .map((work) => {
      const coverImageURL = `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`;
      return (
        <li key={work.key} className="h-fit mx-auto">
          <Link href={`/book/${work.key.split("/").pop()}`}>
            <Image
              src={coverImageURL}
              alt={work.title}
              className="rounded-md bg-slate-200 w-[5rem] h-[7.8rem] sm:w-[7rem] sm:h-[10.5rem]"
              width={200}
              height={300}
            />
          </Link>
        </li>
      );
    });

  const relatedSubjects = subjectData.subjects
    ?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .map((subject) => {
      const link = `/subject/${encodeURI(
        subject.name.toLocaleLowerCase().trim()
      )}
      `;
      return (
        <li
          className="text-sm capitalize underline-offset-2 cursor-pointer hover:underline"
          key={subject.key}
        >
          <Link href={link}>{subject.name}</Link>
        </li>
      );
    });

  function renderRelatedContent(heading: string, content: { name: string }[]) {
    return (
      <div>
        <h2 className="text-[0.9rem] font-semibold">{heading}</h2>
        <ul className="flex flex-wrap gap-2 items-center mt-2">
          {content
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map((item, index) => (
              <li
                className="text-sm capitalize underline-offset-2 cursor-pointer hover:underline"
                key={index}
              >
                {item.name}
              </li>
            ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="wrapper max-w-5xl max-auto flex flex-col gap-4 ">
      <header className="border-b-[1px] border-slate-200 py-3">
        <h4 className="text-sm mt-4">Genre</h4>
        <h2 className="capitalize text-lg font-bold">
          {decodeURIComponent(params.genre)}
        </h2>
      </header>

      <div className="flex flex-col gap-10 pt-3 pb-6 md:grid md:grid-cols-[1fr,300px] md:gap-8">
        <ul className="h-fit grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-y-4 place-items-center sm:gap-x-2 sm:gap-y-2">
          {renderedWorks}
        </ul>

        <div className="flex flex-col gap-10">
          {subjectData?.subjects && (
            <div>
              <h2 className="text-[0.9rem] font-semibold">Related Subjects</h2>
              <ul className="flex flex-wrap gap-2 items-center mt-2">
                {relatedSubjects}
              </ul>
            </div>
          )}

          {subjectData?.authors &&
            renderRelatedContent("Related Authors", subjectData.authors)}

          {subjectData.places &&
            renderRelatedContent("Related Places", subjectData.places)}

          {subjectData.times &&
            renderRelatedContent("Related Times", subjectData.times)}
        </div>
      </div>
    </div>
  );
}

export default SubjectPage;
