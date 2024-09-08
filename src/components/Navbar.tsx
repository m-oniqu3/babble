import { LogoIcon, MenuIcon } from "@/src/components/icons";
import NavButtons from "@/src/components/NavButtons";
import { createClient } from "@/utils/supabase/server";

import Link from "next/link";

async function Navbar() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const isLogged = !!data?.user;

  return (
    <>
      <header className="wrapper h-16 flex flex-col justify-center">
        <nav className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MenuIcon className="w-6 h-6 sm:hidden" />
            <Link href="/">
              <LogoIcon className="w-6 h-6" />
            </Link>

            {isLogged && (
              <ul className="hidden sm:flex items-center gap-2 ml-2 ">
                <li className="text-sm">
                  <Link href="#">Discover</Link>
                </li>
                <li className="text-sm">
                  <Link href="#">Tropes</Link>
                </li>
              </ul>
            )}
          </div>

          <NavButtons isLoggedIn={isLogged} />
        </nav>
      </header>
    </>
  );
}

export default Navbar;
