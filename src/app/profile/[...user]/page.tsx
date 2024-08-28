import { getProfile } from "@/src/app/utils/profile";
import ProfileBody from "@/src/components/profile/ProfileBody";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function ProfilePage({ params }: { params: { user: string } }) {
  console.log("params", params);
  if (!params.user) {
    return <p>Profile not found</p>;
  }

  const user = Array.isArray(params.user) ? params.user[0] : params.user;

  const supabase = createClient();

  // protect the route
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const currentUser = data.user.id;
  const profile = await getProfile(user);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return (
    <div>
      <ProfileHeader profile={profile} currentUser={currentUser} />

      <ProfileBody
        activeProfileID={profile.user_id}
        currentUser={currentUser}
      />
    </div>
  );
}

export default ProfilePage;
