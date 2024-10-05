"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveShelf(formData: FormData) {
  const values = {
    shelfID: formData.get("shelfID"),
    userID: formData.get("userID"),
    isBookmarked: formData.get("isBookmarked"),
  };

  if (!values.userID || !values.shelfID) {
    return {
      data: null,
      error: "You need to be logged in to bookmark a shelf",
    };
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user || data.user.id !== values.userID) {
      return {
        data: null,
        error: `It looks like you're not logged in. Please log in to bookmark this shelf.`,
      };
    }

    if (values.isBookmarked === "true") {
      const { error: deleteError } = await supabase
        .from("saved_shelves")
        .delete()
        .eq("shelf_id", +values.shelfID)
        .eq("user_id", data.user.id);

      if (deleteError) {
        return {
          data: null,
          error: "We're sorry, but we couldn't unbookmark this shelf.",
        };
      }

      return {
        data: "We removed this from your bookmarks. You're welcome.",
        error: null,
      };
    }

    const { data: bookmark, error: bookmarkError } = await supabase
      .from("saved_shelves")
      .insert([
        {
          shelf_id: +values.shelfID,
          user_id: data.user.id,
        },
      ]);

    if (bookmarkError) {
      return {
        data: null,
        error: "We're sorry, but we couldn't bookmark this shelf.",
      };
    }

    return {
      data: "We bookmarked this shelf for you. You're welcome.",
      error: null,
    };
  } catch (error) {
    console.log("Error in saveShelf", error);

    return {
      data: null,
      error: "We're sorry, but we couldn't bookmark this shelf.",
    };
  }
}
