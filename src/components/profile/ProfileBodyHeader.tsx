"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const links = [
  { href: "created", text: "Created" },
  { href: "saved", text: "Saved" },
];

function ProfileBodyHeader() {
  const pathname = usePathname();
  // const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const renderedLinks = links.map((link) => {
    return (
      <li className="text-sm" key={link.href}>
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

export default ProfileBodyHeader;

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
