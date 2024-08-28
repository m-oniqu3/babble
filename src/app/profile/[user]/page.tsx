// "use client";

import ProfileHeader from "@/src/components/profile/ProfileHeader";
import { Profile } from "@/src/types/profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function ProfilePage({ params }: { params: { user: string } }) {
  const supabase = createClient();
  // protect the route
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const currentUser = data.user.id;

  console.log("params", params, params.user);

  async function getProfile(): Promise<Profile | undefined> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("username", params.user)
      .single();

    if (error) {
      console.error("error", error);
      return;
    }

    return data;
  }

  async function getShelves(userID: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("shelves")
      .select()
      .eq("user_id", userID);

    if (error) {
      console.error("error", error);
      return;
    }

    return data;
  }

  const profile = await getProfile();

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const shelves = await getShelves(profile.user_id);

  return (
    <div>
      <ProfileHeader profile={profile} currentUser={currentUser} />
      <p>shelves</p>

      <ul>
        {shelves?.map((shelf) => (
          <li key={shelf.id}>
            <p>{shelf.name}</p>
            <p>{shelf.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfilePage;
