import ButtonLink from "@/src/components/ButtonLink";
import {
  AddIcon,
  LogoIcon,
  MenuIcon,
  SearchIcon,
} from "@/src/components/icons";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

async function Navbar() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  const isLogged = !!data?.user;

  return (
    <header className="wrapper h-14 flex flex-col justify-center">
      <nav className="flex items-center gap-3">
        <MenuIcon className="w-6 h-6" />
        <Link href="/">
          <LogoIcon className="w-6 h-6" />
        </Link>

        {!isLogged && (
          <div className="flex items-center gap-3 ml-auto ">
            <SearchIcon className="w-6 h-6" />

            <ButtonLink route="/login" className="bg-black text-white ">
              Sign in
            </ButtonLink>
          </div>
        )}

        {isLogged && (
          <div className="flex items-center gap-3 ml-auto">
            <p className="flex items-center gap-3 text-sm rounded-lg px-2 h-9 cursor-pointer hover:bg-gray-200">
              <AddIcon className="w-5 h-5" />
              Create
            </p>
            <figure>
              <Image
                src="https://picsum.photos/seed/5/200"
                alt="avatar"
                className="rounded-lg border-4 border-gray-200"
                width={35}
                height={35}
              />
            </figure>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
