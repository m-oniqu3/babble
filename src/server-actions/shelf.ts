"use server";

import { createShelfSchema } from "@/utils/validation/shelf";

export async function createShelf(formData: FormData) {
  try {
    console.log("formData", formData);

    const image = formData.get("cover") as File;

    const validatedFields = createShelfSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      private: formData.get("private"),
      cover: image.size > 0 ? image : null,
    });

    console.log("validatedFields", validatedFields);
    // return early if data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // send data to supabase
  } catch (error) {
    console.log("createShelf error", error);
  }
}
