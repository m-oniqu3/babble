import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getTagsForShelf(
  client: SupabaseClient<Database>,
  shelfID: number,
  URLProfileID: string
) {
  try {
    const { data, error } = await client
      .from("shelf_tags")
      .select("tag_id")
      .eq("shelf_id", shelfID)
      .eq("user_id", URLProfileID)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data) return [];

    // get tags for the shelf
    const tagIDs = data.map((tag) => tag.tag_id);

    const { data: tags, error: tagsError } = await client
      .from("tags")
      .select("id, tag")
      .in("id", tagIDs)
      .order("created_at", { ascending: false });

    if (tagsError) throw tagsError;

    if (!tags) return [];

    return tags;
  } catch (error) {
    console.error("Error fetching tags for shelf", error);
    throw error;
  }
}
