"uee client";

import Button from "@/src/components/Button";
import Container from "@/src/components/Container";
import {
  AddIcon,
  CloseIcon,
  EditIcon,
  LoadingIcon,
} from "@/src/components/icons";
import { createClient } from "@/utils/supabase/client";
import { editShelfSchema, EditShelfSchema } from "@/utils/validation/editShelf";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import useSWR from "swr";

type Props = {
  close: () => void;
  isAuthUser: boolean;
  authUserID: string | null;
  shelfID: number;
};

async function getShelfByUserAndID(user: string | null, shelfID: number) {
  if (!user) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("shelves")
    .select("*")
    .eq("user_id", user)
    .eq("id", shelfID)
    .single();

  if (error) throw error;

  return data;
}

function EditShelf(props: Props) {
  const { close, isAuthUser, authUserID, shelfID } = props;

  const { data, error, isLoading } = useSWR(
    `shelf-${shelfID}`,
    getShelfByUserAndID.bind(null, authUserID, shelfID)
  );

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [currentCover, setCurrentCover] = useState<string | null>(null);

  const form = useForm<EditShelfSchema>({
    resolver: zodResolver(editShelfSchema),
    defaultValues: {
      name: "",
      description: "",
      private: false,
      cover: null,
    },
  });

  const { isSubmitting } = form.formState;

  // when data is fetched, update the form values
  useEffect(() => {
    form.reset({
      name: data?.name,
      description: data?.description || "",
      private: data?.private || false,
    });

    setCurrentCover(data?.cover || null);
  }, [data, form]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];
    setFile(file);

    // update react-hook-form
    form.setValue("cover", file);
  }

  function removeImage() {
    setFile(null);
    imageRef.current!.value = "";
    form.setValue("cover", null);
  }

  function onSubmitForm(input: EditShelfSchema) {
    const originalShelfValues = {
      name: data?.name,
      description: data?.description,
      private: data?.private,
    };

    const formValues = {
      name: input.name,
      description: input.description,
      private: input.private,
    };

    // if !file, then the user didn't change the cover
    if (
      JSON.stringify(formValues) === JSON.stringify(originalShelfValues) &&
      !file
    ) {
      console.log("no changes");
      form.setError("root", { message: "No changes detected." });
      return;
    }

    form.clearErrors("root");

    // server actions don't accept File objects directly
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description || "");
    formData.append("private", input.private ? "true" : "false");
    formData.append("cover", input.cover as File);
    formData.append("originalShelfValues", JSON.stringify(originalShelfValues));
    formData.append("originalCover", data?.cover || "");

    console.log("data", formData);
  }

  return (
    <Container className="min-h-[572px]">
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}

      {!isLoading && !error && (
        <div>
          <header className="relative mb-4">
            <h1 className="text-lg font-semibold">Edit Shelf</h1>
            <p className="text-xs font-light">Customize your shelf.</p>

            <p className="input-error mt-2">
              {form.formState.errors.root?.message}
            </p>

            <button onClick={close} className="absolute top-0 right-0">
              <CloseIcon className="w-5 h-5" />
            </button>
          </header>

          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmitForm)}
          >
            <div>
              <label htmlFor="cover" className="text-xs font-light">
                Shelf Cover
              </label>

              <input
                {...form.register("cover")}
                ref={imageRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
                className="hidden"
              />

              {/* show cover image when it exists and no file is selected */}
              {currentCover && !file && (
                <div className="relative h-28 w-28">
                  <Image
                    src={currentCover}
                    alt={`Cover image for ${form.getValues().name}`}
                    className="h-28 w-28 object-cover rounded-md"
                    width={112}
                    height={112}
                  />

                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("edit image");
                        console.log(imageRef.current);

                        imageRef.current?.click();
                      }}
                      className="bg-white/80 rounded-md p-1 hover:bg-gray-200 transition-colors"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {!currentCover && !file && (
                <>
                  <button
                    type="button"
                    onClick={() => imageRef.current?.click()}
                    className="bg-slate-100 h-28 w-28 flex rounded-md
                items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <AddIcon />
                  </button>

                  <p className="input-error">
                    {form.formState.errors.cover?.message}
                  </p>
                </>
              )}

              {/* show selected file */}
              {file && (
                <div className="relative h-28 w-28">
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => imageRef.current?.click()}
                      className="bg-white/80 rounded-md p-1 hover:bg-gray-200 transition-colors"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-white/80 rounded-md p-1 hover:bg-gray-200 transition-colors"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <Image
                    src={file ? URL.createObjectURL(file) : ""}
                    alt="shelf cover"
                    className="h-28 w-28 object-cover rounded-md"
                    width={112}
                    height={112}
                  />
                </div>
              )}
            </div>

            {/* name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-light">
                Shelf Name
              </label>
              <input
                {...form.register("name")}
                className="bg-slate-100 font-light text-xs h-9 w-full rounded-md px-2 focus:outline-none placeholder:text-xs placeholder:font-light"
                placeholder="romance"
              />

              <p className="input-error">
                {form.formState.errors.name?.message}
              </p>
            </div>

            {/* description */}
            <div className="space-y-1">
              <label htmlFor="description" className="text-xs font-light">
                What is this shelf about?
              </label>
              <textarea
                {...form.register("description")}
                className="bg-slate-100 font-light text-xs h-20 w-full rounded-md p-2 focus:outline-none placeholder:text-xs placeholder:font-light resize-none"
                placeholder="books that had me giggling & kicking my feet at 3 am."
              ></textarea>

              <p className="input-error">
                {form.formState.errors.description?.message}
              </p>
            </div>

            {/* private */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("private")}
                id="private"
                className="h-4 w-4 accent-slate-200"
              />
              <label
                htmlFor="private"
                className="text-xs font-light h-full mt-0!"
              >
                Is this shelf private?
              </label>

              <p className="input-error">
                {form.formState.errors.private?.message}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-black text-white rounded-md"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    Creating
                    <span className="animate-spin text-white">
                      <LoadingIcon className="size-5" />
                    </span>
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}

export default EditShelf;
