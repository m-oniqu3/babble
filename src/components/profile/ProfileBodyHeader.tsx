"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "_created", text: "Created" },
  { href: "_saved", text: "Saved" },
];

function ProfileBodyHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const splitPathname = pathname.slice(1).split("/");
  const [path, username] = splitPathname;

  const renderedLinks = links.map((link) => {
    return (
      <li className="text-sm" key={link.href}>
        <Link
          href={`/${path}/${username}/${link.href}
          `}
        >
          {link.text}
        </Link>
      </li>
    );
  });

  return (
    <header className="bg-white sticky top-20 z-[1]">
      <nav className="h-24 wrapper">
        <ul className="flex justify-center items-center gap-8 h-full text-base">
          {renderedLinks}
        </ul>
      </nav>
    </header>
  );
}

export default ProfileBodyHeader;
