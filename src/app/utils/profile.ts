import { Profile } from "@/src/types/profile";
import { createClient } from "@/utils/supabase/server";

export async function getProfile(user: string): Promise<Profile | undefined> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("username", user)
    .single();

  if (error) {
    console.error("error", error);
    return;
  }

  return data;
}
