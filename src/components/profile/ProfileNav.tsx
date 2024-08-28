"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const links = [
  { href: "created", text: "Created" },
  { href: "saved", text: "Saved" },
];

function ProfileNav() {
  const pathname = usePathname();
  // const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("page");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const activeClass = "border-gray-600";

  const renderedLinks = links.map((link) => {
    const isActive =
      search === link.href || (!search && link.href === "created");

    return (
      <li
        className={`text-sm py-1 border-b-[3px] ${
          isActive ? activeClass : " border-transparent"
        }
      `}
        key={link.href}
      >
        <Link
          href={pathname + "?" + createQueryString("page", link.href)}
          className="cursor-pointer"
        >
          {link.text}
        </Link>
      </li>
    );
  });

  return (
    <header className="bg-white sticky top-0 z-[1]">
      <nav className="h-24 wrapper">
        <ul className="flex justify-center items-center gap-8 h-full text-base">
          {renderedLinks}
        </ul>
      </nav>
    </header>
  );
}

export default ProfileNav;

/**
 *  <p
          className="cursor-pointer"
          onClick={() => {
            router.push(pathname + "?" + createQueryString("page", link.href));
          }}
        >
          {link.text}
        </p> 
 */
