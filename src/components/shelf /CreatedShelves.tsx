import { formatDate } from "@/src/app/utils/formatDate";
import { getProfile } from "@/src/app/utils/profile";
import { getShelves } from "@/src/app/utils/shelves";
import ShelfPreview from "@/src/components/shelf /ShelfPreview";
import { createClient } from "@/utils/supabase/server";

type Props = {
  activeProfileUsername: string;
};

async function CreatedShelves({ activeProfileUsername }: Props) {
  const supabase = createClient();

  const profile = await getProfile(activeProfileUsername);
  const { data, error } = await supabase.auth.getUser();

  if (!profile || error || !data?.user) {
    return <p>User not found</p>;
  }

  const shelves = await getShelves(profile.user_id);

  if (!shelves) {
    return <p>No shelves created yet</p>;
  }

  const currentUser = data.user.id;
  const isCurrentUser = currentUser === profile.user_id;

  const renderedShelves = shelves.map((shelf) => {
    return (
      <div key={shelf.id}>
        <ShelfPreview isCurrentUser={isCurrentUser} shelf={shelf} />

        <div className="py-2">
          <h2 className="font-semibold text-lg">{shelf.name}</h2>
          <div className="flex gap-2 items-center">
            <p className="text-xs">{shelf.name.length} Books</p>
            <p className="text-xs text-gray-500">
              {formatDate(new Date(shelf.created_at))}
            </p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="wrapper shelves-grid">{renderedShelves}</div>
    </div>
  );
}

export default CreatedShelves;
