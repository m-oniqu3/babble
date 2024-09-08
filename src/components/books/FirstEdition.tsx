import { Edition } from "@/src/types/search";

type Props = {
  edition: Edition;
};

function FirstEdition(props: Props) {
  const {
    notes,
    publish_date,
    publishers,
    title,
    full_title,
    subtitle,
    number_of_pages,
  } = props.edition;

  function renderEdtion(content: string | undefined, title: string) {
    if (!content) return null;

    return (
      <p className="grid grid-cols-[140px,1fr] gap-2 text-[0.8rem]">
        <span className="text-[#707070]">{title}</span>
        <span>{content}</span>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h2 className="text-[0.9rem] font-semibold">Edition Information</h2>

      <div className="space-y-2">
        {/* title */}
        {renderEdtion(title, "Title")}

        {/* full title */}
        {renderEdtion(full_title, "Full Title")}

        {/* subtitle */}
        {renderEdtion(subtitle, "Subtitle")}

        {/* publishers */}
        {renderEdtion(publishers?.join(", "), "Publishers")}

        {/* publish date */}
        {renderEdtion(publish_date, "Publish Date")}

        {/* number of pages */}
        {renderEdtion(number_of_pages?.toString(), "Number of Pages")}

        {/* notes */}
        {renderEdtion(notes?.value, "Notes")}
      </div>
    </div>
  );
}

export default FirstEdition;
