import { LogoIcon, MenuIcon } from "@/src/components/icons";
import NavButtons from "@/src/components/NavButtons";
import { createClient } from "@/utils/supabase/server";

import Link from "next/link";

async function getUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) return;

  const profile = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", data.user.id)
    .single();

  if (profile.error) return;

  if (!profile.data?.username) return { userID: data.user.id, username: null };

  return { userID: data.user.id, username: profile.data.username };
}

async function Navbar() {
  const user = await getUser();

  const username = user?.username;
  const authUserID = user?.userID || null;
  const isLogged = !!authUserID;

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
                  <Link href="/discover">Discover</Link>
                </li>
                <li className="text-sm">
                  <Link href="#">Tropes</Link>
                </li>
                <li className="text-sm">
                  <Link href={`/profile/${username}`}>Shelves</Link>
                </li>
              </ul>
            )}
          </div>

          <NavButtons isLoggedIn={isLogged} authUserID={authUserID} />
        </nav>
      </header>
    </>
  );
}

export default Navbar;
