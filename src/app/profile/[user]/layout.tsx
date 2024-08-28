import { getProfile } from "@/src/app/utils/profile";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ProfileNav from "@/src/components/profile/ProfileNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: { user: string };
};

export default async function ProfileLayout({ children, params }: Props) {
  const user = params.user;
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
    <section>
      <ProfileHeader profile={profile} currentUser={currentUser} />
      <ProfileNav />

      {children}
    </section>
  );
}
