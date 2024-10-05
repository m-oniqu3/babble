import { Shelf } from "@/src/types/shelves";
import { getRange } from "@/src/utils/paginate";
import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getShelves(
  client: SupabaseClient<Database>,
  page: number,
  userID: string
) {
  try {
    const range = getRange(page, 10);

    const { data, error } = await client
      .from("shelves")
      .select()
      .eq("user_id", userID)
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    if (error) throw error;

    return data as Shelf[];
  } catch (error) {
    console.log("Error getting shelves for user", error);
    throw error;
  }
}
