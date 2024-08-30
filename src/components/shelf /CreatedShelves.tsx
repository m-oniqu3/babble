import { formatDate } from "@/src/app/utils/formatDate";
import { getProfile } from "@/src/app/utils/profile";
import { getShelves } from "@/src/app/utils/shelves";
import ShelfPreview from "@/src/components/shelf /ShelfPreview";
import { createClient } from "@/utils/supabase/server";

type Props = {
  URLProfileUsername: string;
};

async function getCurrentUser() {
  const supabase = createClient();
  console.log("getting current user");

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }
  return data.user.id;
}

async function CreatedShelves({ URLProfileUsername }: Props) {
  const profile = await getProfile(URLProfileUsername);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  // promise.all to get user and shelves
  const [shelves, authUserID] = await Promise.all([
    getShelves(profile.user_id),
    getCurrentUser(),
  ]);

  if (!shelves) {
    return <p>No shelves created yet</p>;
  }

  const isAuthUser = authUserID === profile.user_id;

  const renderedShelves = shelves.map((shelf) => {
    return (
      <div key={shelf.id}>
        <ShelfPreview
          authUserID={authUserID}
          isAuthUser={isAuthUser}
          shelf={shelf}
        />

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
