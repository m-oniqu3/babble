import { getProfile } from "@/src/app/utils/profile";
import ShelfHeader from "@/src/components/shelf /ShelfHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function getShelfByUserAndName(user: string | null, shelfName: string) {
  if (!user) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("shelves")
    .select("*")
    .eq("user_id", user)
    .eq("name", shelfName)
    .single();

  if (error) throw error;

  return data;
}

type Props = {
  params: { user: string; shelf: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function page({ params, searchParams }: Props) {
  // if the user or shelf is not provided, redirect to the home page
  if (!params.user || !params.shelf) {
    return redirect("/");
  }

  const supabase = createClient();

  // get the profile and the logged in user
  const [profile, authUser] = await Promise.all([
    getProfile(params.user),
    supabase.auth.getUser(),
  ]);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  //URLProfileUsername: string;

  const authUserID = authUser.data.user?.id || null;
  const URLProfileID = profile.user_id;
  const decodedShelfName = decodeURIComponent(params.shelf);

  //get the shelf for the user with urlprofileid
  const shelf = await getShelfByUserAndName(URLProfileID, decodedShelfName);

  const isPrivate = shelf?.private && authUserID !== URLProfileID;

  if (!shelf || isPrivate) {
    return <p>Shelf not found</p>;
  }

  return (
    <div>
      <ShelfHeader shelf={shelf} profile={profile} authUserID={authUserID} />
    </div>
  );
}

export default page;
