import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const editShelfSchema = z.object({
  name: z
    .string({ message: "Shelf name is required" })
    .min(3, "Name should be at least 3 characters")
    .max(50, "Name should be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(300, "Description should be at most 300 characters")
    .optional()
    .or(z.literal("")),
  private: z.coerce.boolean().optional().or(z.literal(false)),
  cover: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file ? file.type : "");
    }, "File must be a PNG")
    .optional()
    .or(z.literal(null)),
});

export type EditShelfSchema = z.infer<typeof editShelfSchema>;
