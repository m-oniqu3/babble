import { getProfile } from "@/src/app/utils/profile";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ProfileNav from "@/src/components/profile/ProfileNav";
import CreatedShelves from "@/src/components/shelf /CreatedShelves";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: { user: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function ProfilePage({ params, searchParams }: Props) {
  if (!params.user) {
    return <p>Profile not found</p>;
  }

  const supabase = createClient();

  const [profile, currentUser] = await Promise.all([
    getProfile(params.user),
    supabase.auth.getUser(),
  ]);

  const currentUserID = currentUser.data.user?.id || null;

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const page = "view" in searchParams ? (searchParams.view as string) : null;

  function switchPage(page: string | null) {
    switch (page) {
      case "created":
        return <CreatedShelves URLProfileUsername={params.user} />;
      case "saved":
        return <p>Saved page</p>;
      default:
        return <CreatedShelves URLProfileUsername={params.user} />;
    }
  }

  return (
    <div>
      <ProfileHeader profile={profile} currentUser={currentUserID} />
      <ProfileNav />

      {switchPage(page)}
    </div>
  );
}

export default ProfilePage;
