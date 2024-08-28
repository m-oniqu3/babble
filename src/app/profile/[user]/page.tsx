import { getProfile } from "@/src/app/utils/profile";
import { getShelves } from "@/src/app/utils/shelves";
import ProfileBody from "@/src/components/profile/ProfileBody";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function ProfilePage({ params }: { params: { user: string } }) {
  if (!params.user) {
    return <p>Profile not found</p>;
  }

  const supabase = createClient();

  // protect the route
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const currentUser = data.user.id;
  const profile = await getProfile(params.user);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const shelves = await getShelves(profile.user_id);

  return (
    <div>
      <ProfileHeader profile={profile} currentUser={currentUser} />

      <ProfileBody shelves={shelves} currentUser={currentUser} />
    </div>
  );
}

export default ProfilePage;
