"use client";

import { getTagsForShelf } from "@/src/utils/tags/getTagsForShelf";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Props = {
  shelfID: number;
  URLProfileID: string;
};

function ShelfTags(props: Props) {
  const { shelfID, URLProfileID } = props;

  const supabase = createClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["shelf-tags", shelfID, URLProfileID],
    queryFn: getTagsForShelf.bind(null, supabase, shelfID, URLProfileID),
  });

  if (isLoading) {
    const slots = Array.from({ length: 3 }, (_, i) => i);
    return (
      <ul className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <li key={slot} className="px-2 py-1 bg-slate-100 w-7 rounded-md"></li>
        ))}
      </ul>
    );
  }

  if (isError) return null;

  if (!data) return null;

  const renderTags = data.map((tag) => {
    return (
      <li
        key={tag.id}
        className="bg-slate-100 text-xs font-medium px-2 py-1 rounded-md"
      >
        #{tag.tag}
      </li>
    );
  });
  return (
    <ul className="flex flex-wrap justify-center items-center gap-2">
      {renderTags}
    </ul>
  );
}

export default ShelfTags;
