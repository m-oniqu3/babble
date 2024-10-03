import { LoadingIconTwo } from "@/src/components/icons";
import SavedBooksOnShelf from "@/src/components/shelf/SavedBooksOnShelf";
import ShelfHeader from "@/src/components/shelf/ShelfHeader";
import { getProfile } from "@/src/utils/profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

/**
 *
 * @param user string | null
 * @param shelfName string
 * @description Get the shelf by the user and the shelf name
 */
async function getShelfByUserAndName(user: string | null, shelfName: string) {
  if (!user) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("shelves")
    .select("*")
    .eq("user_id", user)
    .eq("name", shelfName)
    .single();

  return { data, error };
}

type Props = {
  params: { user: string; shelf: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function page({ params }: Props) {
  console.log("params", params);
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

  if (shelf?.error) {
    console.error("Error getting shelf", shelf.error);
    return <p>Error getting shelf</p>;
  }

  const isPrivate = shelf?.data?.private && authUserID !== URLProfileID;

  if (!shelf?.data || isPrivate) {
    return <p>Shelf not found</p>;
  }

  return (
    <div>
      <ShelfHeader
        shelf={shelf.data}
        profile={profile}
        authUserID={authUserID}
      />

      <Suspense
        fallback={<LoadingIconTwo className="wrapper size-7 text-gray-500" />}
      >
        <SavedBooksOnShelf
          URLProfileID={URLProfileID}
          shelfID={shelf.data.id}
          authUserID={authUserID}
        />
      </Suspense>
    </div>
  );
}

export default page;
