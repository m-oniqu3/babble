"use client";

import { EditIcon } from "@/src/components/icons";
import { Shelf } from "@/src/types/shelves";
import Image from "next/image";
import { useState } from "react";

type Props = {
  isCurrentUser: boolean;
  shelf: Shelf;
};

function ShelfPreview(props: Props) {
  const { isCurrentUser, shelf } = props;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <figure
      onMouseEnter={() => setIsHovering((state) => !state)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ width: "14.75rem", height: "9.8rem" }}
      className="relative cursor-pointer"
    >
      {isCurrentUser && isHovering && (
        <div className="absolute bottom-2 right-2 bg-white/70 rounded-full p-2 cursor-pointer transition-colors hover:bg-white">
          <EditIcon className="size-4" />
        </div>
      )}

      <Image
        src={
          shelf.cover ||
          `https://picsum.photos/seed/${shelf.name.length + 5}}400/300`
        }
        alt={shelf.name}
        className="h-full w-full object-cover rounded-xl"
        width={14.75 * 16}
        height={9.8 * 16}
      />
    </figure>
  );
}

export default ShelfPreview;
