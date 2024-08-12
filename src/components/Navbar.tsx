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
      <header className="wrapper h-14 flex flex-col justify-center">
        <nav className="flex items-center gap-3">
          <MenuIcon className="w-6 h-6" />
          <Link href="/">
            <LogoIcon className="w-6 h-6" />
          </Link>

          <NavButtons isLoggedIn={isLogged} />
        </nav>
      </header>
    </>
  );
}

export default Navbar;
