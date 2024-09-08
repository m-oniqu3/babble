"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { createShelfSchema } from "@/utils/validation/createShelf";
import { revalidatePath } from "next/cache";

// todo move to utils
export const transformZodErrors = (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join(".") as "name" | "description" | "private" | "cover",
    message: issue.message,
  }));
};

export async function createShelf(formData: FormData) {
  try {
    const image = formData.get("cover") as File;

    const validatedFields = createShelfSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      private: formData.get("private") === "true" ? true : false,
      cover: image.size > 0 ? image : null,
    });

    // send data to supabase with the validated fields
    console.log("validatedFields", validatedFields);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("shelves")
      .insert([
        {
          name: validatedFields.name,
          description: validatedFields.description,
          private: validatedFields.private ?? false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("error", error);
      throw error;
    }

    revalidatePath("/"); // todo : change to the shelf page when it's created
    return {
      errors: null,
      data: `Shelf ${data.name} created successfully`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: transformZodErrors(error),
        data: null,
      };
    }

    if ((error as any).code === "23505") {
      return {
        errors: [
          {
            message: "A shelf with that name already exists.",
            path: "name",
          } as {
            message: string;
            path: "name";
          },
        ],

        data: null,
      };
    }

    return {
      errors: {
        message: "An unexpected error occurred. Could not create shelf.",
      },
      data: null,
    };
  }
}
