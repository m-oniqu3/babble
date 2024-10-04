"use server";

import { createClient } from "@/utils/supabase/server";

export async function createTag(formData: FormData) {
  const tag = formData.get("tag") as string;

  if (!tag) {
    return {
      data: null,
      error: `We're sorry, but we couldn't create this tag.`,
    };
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    // check if a user is logged in
    if (error || !data.user) {
      return {
        data: null,
        error: `It looks like you're not logged in. Please log in to create a tag.`,
      };
    }

    const { data: tagData, error: tagError } = await supabase
      .from("tags")
      .insert([{ tag: tag.split(" ").join("-") }])
      .select("id, tag")
      .single();

    if (tagError) {
      return {
        data: null,
        error: `We're sorry, but we couldn't create this tag.`,
      };
    }

    return {
      data: tagData,
      error: null,
    };
  } catch (error) {
    console.log("Error in createTag:", error);

    return {
      data: null,
      error: `We're sorry, but we couldn't create this tag.`,
    };
  }
}
