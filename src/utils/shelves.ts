import { getRange } from "@/src/utils/paginate";
import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getShelves(
  client: SupabaseClient<Database>,
  page: number,
  userID: string
) {
  try {
    const range = getRange(page, 5);

    const { data, error } = await client
      .from("shelves")
      //get bookmarked shelves from saved_shelves
      .select(`*, saved_shelves(id)`)
      .eq("user_id", userID)
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    if (error) throw error;

    const shelvesWithBookmarks = data.map((shelf) => {
      const isBookmarked = shelf.saved_shelves.length > 0;
      return { ...shelf, isBookmarked };
    });

    return shelvesWithBookmarks;
  } catch (error) {
    console.log("Error getting shelves for user", error);
    throw error;
  }
}
