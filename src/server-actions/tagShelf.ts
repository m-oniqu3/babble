"use server";

import { createClient } from "@/utils/supabase/server";

/**
 *
 * @param formData FormData
 * @description Tag a shelf with one or more tags
 */
export async function tagShelf(formData: FormData) {
  const values = {
    shelfID: formData.get("shelfID") as string,
    tagsToAdd: formData.get("tagsToAdd") as string,
    tagsToRemove: formData.get("tagsToRemove") as string,
    userID: formData.get("userID") as string,
  };

  if (!values.shelfID || !values.userID) {
    return {
      data: null,
      error: `We're sorry, but we couldn't tag this shelf.`,
    };
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user || data.user.id !== values.userID) {
      return {
        data: null,
        error: `It looks like you're not logged in. Please log in to tag this shelf.`,
      };
    }

    //convert the strings to arrays
    const tagsToAddArray = JSON.parse(values.tagsToAdd) as number[];
    const tagsToRemoveArray = JSON.parse(values.tagsToRemove) as number[];

    //are tagsToAddArray & tagsToRemoveArray valid arrays?
    if (!Array.isArray(tagsToAddArray) || !Array.isArray(tagsToRemoveArray)) {
      return {
        data: null,
        error: `We're sorry, but we couldn't tag this shelf.`,
      };
    }

    // insert the new tags
    const insertPromises = tagsToAddArray.map((tagID) => {
      return supabase.from("shelf_tags").insert([
        {
          shelf_id: +values.shelfID,
          tag_id: tagID,
          user_id: data.user.id,
        },
      ]);
    });

    // remove the tags
    const removePromises = tagsToRemoveArray.map((tagID) => {
      return supabase
        .from("shelf_tags")
        .delete()
        .eq("shelf_id", +values.shelfID)
        .eq("tag_id", tagID)
        .eq("user_id", data.user.id);
    });

    await Promise.all([...insertPromises, ...removePromises]);

    return {
      data: "Your shelf has been updated!",
      error: null,
    };
  } catch (error) {
    console.log("Error in tagShelf:", error);

    return {
      data: null,
      error: `We're sorry, but we couldn't update the tags this shelf.`,
    };
  }
}
