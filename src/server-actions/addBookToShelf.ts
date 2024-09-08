"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 *
 * @param formData FormData
 * @description Add & remove a book(s) to a user's shelf
 */
export async function addBookToShelf(formData: FormData) {
  const values = {
    bookID: formData.get("bookID") as string,
    userID: formData.get("userID") as string,
    shelvesToAdd: formData.get("shelvesToAdd") as string,
    shelvesToRemove: formData.get("shelvesToRemove") as string,
    coverID: formData.get("coverID") as string,
  };

  if (!values.bookID || !values.userID) {
    return {
      data: null,
      error: `We're sorry, but we couldn't add this book to your shelf.`,
    };
  }

  try {
    const supabase = createClient();

    // check if a user is logged in & that the given user is the same as the one in the form
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user || data.user.id !== values.userID) {
      return {
        data: null,
        error: `It looks like you're not logged in. Please log in to update your shelf.`,
      };
    }

    // convert the strings to arrays
    const shelvesToAddArray = JSON.parse(values.shelvesToAdd) as number[];
    const shelvesToRemoveArray = JSON.parse(values.shelvesToRemove) as number[];

    // are shelvesToAddArray & shelvesToRemoveArray valid arrays?
    if (
      !Array.isArray(shelvesToAddArray) ||
      !Array.isArray(shelvesToRemoveArray)
    ) {
      return {
        data: null,
        error: `We're sorry, but we couldn't add this book to your shelf.`,
      };
    }

    // add the book to new shelves
    const insertPromises = shelvesToAddArray.map((shelfID) => {
      return supabase.from("saved_books").insert([
        {
          user_id: data.user.id,
          book_id: values.bookID,
          shelf_id: shelfID,
          cover_id: values.coverID,
        },
      ]);
    });

    // remove the book from old shelves
    const deletePromises = shelvesToRemoveArray.map((shelfID) => {
      return supabase
        .from("saved_books")
        .delete()
        .eq("user_id", data.user.id)
        .eq("book_id", values.bookID)
        .eq("shelf_id", shelfID);
    });

    // wait for all the insert & delete promises to resolve
    await Promise.all([...insertPromises, ...deletePromises]);

    // revalidate the /book page
    revalidatePath("/book");

    return { data: "Successfully updated your shelf.", error: null };
  } catch (error) {
    console.error("Error adding/deleting book to shelf", error);

    return {
      data: null,
      error: `Something went wrong. We're sorry, but we couldn't update your shelf.`,
    };
  }
}
