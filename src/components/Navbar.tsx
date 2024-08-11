import ButtonLink from "@/src/components/ButtonLink";
import {
  AddIcon,
  LogoIcon,
  MenuIcon,
  SearchIcon,
} from "@/src/components/icons";
import ProfileAvatar from "@/src/components/profile/ProfileAvatar";
import { createClient } from "@/utils/supabase/server";

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

        <>
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
              <p className="flex items-center gap-3 text-sm px-2 h-8 cursor-pointer hover:bg-gray-200">
                <AddIcon className="w-5 h-5" />
                Create
              </p>
              <ProfileAvatar />
            </div>
          )}
        </>
      </nav>
    </header>
  );
}

export default Navbar;
