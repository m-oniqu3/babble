import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/src/app/login/action";
import Image from "next/image";
import Link from "next/link";

type Checked = DropdownMenuCheckboxItemProps["checked"];

function ProfileAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <figure className="cursor-pointer">
          <Image
            src="https://picsum.photos/seed/5/200"
            alt="avatar"
            className="rounded-lg border-4 border-gray-200"
            width={35}
            height={35}
            priority
          />
        </figure>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 m-4">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>

        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="bg-red-300 w-full" href="/private">
            Private
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileAvatar;
