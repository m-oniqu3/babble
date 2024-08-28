import { Shelves } from "@/src/types/shelves";
import Link from "next/link";

type Props = {
  shelves: Shelves | null;
  currentUser: string;
};

function ProfileBody({}: Props) {
  return (
    <div>
      <header className="bg-white sticky top-20 z-[1]">
        <nav className="h-24 wrapper">
          <ul className="flex justify-center items-center gap-8 h-full text-base">
            <li className="text-sm">
              <Link href="#">Created</Link>
            </li>
            <li className="text-sm">
              <Link href="#">Saved</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default ProfileBody;
