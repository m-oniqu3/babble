import { getProfile } from "@/src/app/utils/profile";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ProfileNav from "@/src/components/profile/ProfileNav";
import { createClient } from "@/utils/supabase/server";

type Props = {
  children: React.ReactNode;
  params: { user: string };
};

export default async function ProfileLayout({ children, params }: Props) {
  const user = params.user;
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  // const currentUser = data?.user?.id || null;
  // const profile = await getProfile(user);

  const [profile, currentUser] = await Promise.all([
    getProfile(user),
    supabase.auth.getUser(),
  ]);
  const currentUserID = currentUser.data.user?.id || null;

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return (
    <section>
      <ProfileHeader profile={profile} currentUser={currentUserID} />
      <ProfileNav />

      {children}
    </section>
  );
}
