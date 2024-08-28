import { Shelves } from "@/src/types/shelves";
import { createClient } from "@/utils/supabase/server";

export async function getShelves(userID: string): Promise<Shelves | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("shelves")
    .select()
    .eq("user_id", userID);

  if (error) {
    console.error("error", error);
    return null;
  }

  return data;
}
