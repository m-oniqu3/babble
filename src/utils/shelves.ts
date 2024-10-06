import { Shelf } from "@/src/types/shelves";
import { getRange } from "@/src/utils/paginate";
import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCreatedShelves(
  client: SupabaseClient<Database>,
  page: number,
  userID: string,
  authUserID: string | null
) {
  try {
    const range = getRange(page, 5);

    const { data, error } = await client
      .from("shelves")
      //get bookmarked shelves from saved_shelves
      .select(`*, saved_shelves(user_id)`)
      .eq("user_id", userID)
      .order("created_at", { ascending: false })
      .range(range[0], range[1])
      // get the shelves that have been bookmarked by the auth user
      .filter("saved_shelves.user_id", "eq", authUserID);

    if (error) throw error;

    const shelvesWithBookmarks = data.map((shelf) => {
      const isBookmarked =
        shelf.saved_shelves?.length > 0
          ? shelf.saved_shelves[0].user_id === authUserID
          : false || false;
      return {
        ...shelf,
        isBookmarked: isBookmarked,
      };
    });

    return shelvesWithBookmarks;
  } catch (error) {
    console.log("Error getting shelves for user", error);
    throw error;
  }
}

/**
 *
 * @description Get the saved shelves for the user in the URL and check if the logged in user has bookmarked any of the shelves
 */
export async function getSavedShelves(
  client: SupabaseClient<Database>,
  page: number,
  URLProfileID: string,
  authUserID: string | null
) {
  try {
    const range = getRange(page, 5);

    // get saved shelves for the current profile in the URL
    const { data, error } = await client
      .from("saved_shelves")
      .select(`shelf_id, user_id, shelves(*)`)
      .eq("user_id", URLProfileID)
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    if (error) throw error;

    // get the shelves from the saved_shelves
    const savedShelvesForURLProfile = data.map((entry) => {
      return entry.shelves as Shelf;
    });

    // if not logged in, no need to check if the shelves are bookmarked
    if (!authUserID) {
      return savedShelvesForURLProfile;
    }

    // how do i know if the auth user has bookmarked the shelf?
    // check if the auth user id is in the saved_shelves with the same shelf id

    const savedShelvesIDsForURLProfile = savedShelvesForURLProfile.map(
      (shelf) => shelf.id
    );

    // check if the auth user has bookmarked any of the shelves for the user from URL profile
    const { data: authUserData, error: authUserError } = await client
      .from("saved_shelves")
      .select(`shelf_id`)
      .in("shelf_id", savedShelvesIDsForURLProfile)
      .eq("user_id", authUserID);

    if (authUserError) throw authUserError;

    // use set for faster lookup
    const savedShelvesIDsForAuthUser = new Set(
      authUserData.map((entry) => entry.shelf_id)
    );

    //check if the auth user has bookmarked the shelf
    const URLProfileShelvesWithAuthUserBookmarks =
      savedShelvesForURLProfile.map((shelf) => {
        const isBookmarked = savedShelvesIDsForAuthUser.has(shelf.id);

        return { ...shelf, isBookmarked };
      });

    return URLProfileShelvesWithAuthUserBookmarks;
  } catch (error) {
    console.log("Error getting saved shelves for user", error);
    throw error;
  }
}
