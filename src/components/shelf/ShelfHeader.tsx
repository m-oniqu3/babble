import { PrivateIcon } from "@/src/components/icons";
import EditShelfOptions from "@/src/components/shelf/EditShelfOptions";
import EditShelfTagsOptions from "@/src/components/shelf/EditShelfTagsOptions";
import ShelfTags from "@/src/components/shelf/ShelfTags";
import { Profile } from "@/src/types/profile";
import { Shelf } from "@/src/types/shelves";
import { getTagsForShelf } from "@/src/utils/tags/getTagsForShelf";
import { createClient } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Image from "next/image";

type Props = {
  shelf: Shelf;
  profile: Profile;
  authUserID: string | null;
};

async function ShelfHeader(props: Props) {
  const { shelf, profile, authUserID } = props;

  const isAuthUser = authUserID === profile.user_id;
  const queryClient = new QueryClient();
  const supabase = createClient();

  // prefetch the tags for the shelf
  queryClient.prefetchQuery({
    queryKey: ["shelf-tags", shelf.id, profile.user_id],
    queryFn: () => getTagsForShelf(supabase, shelf.id, profile.user_id),
  });

  return (
    <header className="wrapper flex flex-col gap-2 items-center text-center my-4 max-w-md">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <h2 className="font-bold text-3xl">{shelf.name}</h2>
        {isAuthUser && (
          <div className="w-fit h-fit flex gap-2">
            <EditShelfOptions
              isAuthUser={isAuthUser}
              authUserID={authUserID}
              shelfID={shelf.id}
            />

            <EditShelfTagsOptions
              isAuthUser={isAuthUser}
              authUserID={authUserID}
              shelfID={shelf.id}
              URLProfileID={profile.user_id}
            />
          </div>
        )}
      </div>

      <p className="text-[.9rem]">{shelf.description}</p>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShelfTags shelfID={shelf.id} URLProfileID={profile.user_id} />
      </HydrationBoundary>

      <p className="text-sm ">
        {!shelf.book_count
          ? "0 books"
          : shelf.book_count > 1
          ? `${shelf.book_count} books`
          : `${shelf.book_count} book`}
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
