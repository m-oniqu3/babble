import { PrivateIcon } from "@/src/components/icons";
import EditShelfOptions from "@/src/components/shelf /EditShelfOptions";
import { Profile } from "@/src/types/profile";
import { Shelf } from "@/src/types/shelves";
import Image from "next/image";

type Props = {
  shelf: Shelf;
  profile: Profile;

  authUserID: string | null;
};

function ShelfHeader(props: Props) {
  const { shelf, profile, authUserID } = props;

  const isAuthUser = authUserID === profile.user_id;

  return (
    <header className="wrapper flex flex-col gap-2 items-center text-center my-4 max-w-md">
      <div className="flex gap-3">
        <h2 className="font-bold text-3xl">{shelf.name}</h2>
        <div className="w-fit h-fit relative top-1">
          {isAuthUser && (
            <EditShelfOptions
              isAuthUser={isAuthUser}
              authUserID={authUserID}
              shelfID={shelf.id}
            />
          )}
        </div>
      </div>

      <p className="text-[.9rem]">{shelf.description}</p>
      <p className="text-sm ">
        {shelf.book_count || shelf.name.length}&nbsp;books
      </p>

      {shelf.private && (
        <p className="text-sm flex gap-1 items-center">
          <PrivateIcon className="size-4 text-zinc-600" />
          <span className="text-zinc-600">Private Shelf</span>
        </p>
      )}

      <figure>
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt="avatar"
            className="size-12 object-cover rounded-full "
            width={80}
            height={80}
          />
        ) : (
          <Image
            src={`https://picsum.photos/seed/${profile.username.length}/200`}
            alt="avatar"
            className="size-12 object-cover rounded-full "
            width={80}
            height={80}
          />
        )}
      </figure>
    </header>
  );
}

export default ShelfHeader;
