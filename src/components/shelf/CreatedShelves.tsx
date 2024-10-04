import ShelfPreview from "@/src/components/shelf/ShelfPreview";
import { getProfile } from "@/src/utils/profile";
import { getShelves } from "@/src/utils/shelves";
import { createClient } from "@/utils/supabase/server";

type Props = {
  URLProfileUsername: string;
};

async function getCurrentUser() {
  const supabase = createClient();

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

  const renderedShelves = shelves
    // only show private shelves to the owner
    .filter((shelf) => {
      if (isAuthUser) return shelf;
      else return !shelf.private;
    })
    .map((shelf) => {
      return (
        <ShelfPreview
          key={shelf.id}
          authUserID={authUserID}
          isAuthUser={isAuthUser}
          shelf={shelf}
          URLProfileID={profile.user_id}
        />
      );
    });

  return <div className="wrapper shelves-grid pb-16">{renderedShelves}</div>;
}

export default CreatedShelves;
