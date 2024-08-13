"use client";

import Button from "@/src/components/Button";
import Container from "@/src/components/Container";
import { AddIcon, CloseIcon, EditIcon } from "@/src/components/icons";
import { createShelf } from "@/src/server-actions/shelf";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  close: () => void;
};

function CreateShelf({ close }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  // iterate over the files and add them to the state
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];
    setFile(file);
  }

  return (
    <Container>
      <header className="relative mb-4">
        <h1 className="text-lg font-semibold">Create Shelf</h1>
        <p className="text-xs font-light">
          Create a shelf to organize your books.
        </p>

        <button onClick={close} className="absolute top-0 right-0">
          <CloseIcon className="w-5 h-5" />
        </button>
      </header>

      <form className="space-y-4" action={createShelf}>
        <div className="space-y-1">
          <label htmlFor="cover" className="text-xs font-light">
            Shelf Cover
          </label>

          {file ? (
            <div className="relative h-28 w-28">
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button
                  onClick={() => imageRef.current?.click()}
                  className="bg-white/80 rounded-md p-1 hover:bg-gray-200 transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setFile(null)}
                  className="bg-white/80 rounded-md p-1 hover:bg-gray-200 transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              <Image
                src={URL.createObjectURL(file)}
                alt="shelf cover"
                className="h-28 w-28 object-cover rounded-md"
                width={112}
                height={112}
              />
            </div>
          ) : (
            <button
              onClick={() => imageRef.current?.click()}
              className="bg-slate-100 h-28 w-28 flex rounded-md
                items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <AddIcon />
            </button>
          )}

          <input
            name="cover"
            ref={imageRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-light">
            Shelf Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-slate-100 font-light text-xs h-9 w-full rounded-md px-2 focus:outline-none placeholder:text-xs placeholder:font-light"
            placeholder="romance"
            required
          />
        </div>

        {/* description */}
        <div className="space-y-1">
          <label htmlFor="description" className="text-xs font-light">
            What is this shelf about?
          </label>
          <textarea
            id="description"
            name="description"
            className="bg-slate-100 font-light text-xs h-20 w-full rounded-md p-2 focus:outline-none placeholder:text-xs placeholder:font-light resize-none"
            placeholder="books that had me giggling & kicking my feet at 3 am."
            required
          ></textarea>
        </div>

        {/* private */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="private"
            id="private"
            value="private"
            className="h-4 w-4 accent-slate-200"
          />
          <label htmlFor="private" className="text-xs font-light h-full mt-0!">
            Is this shelf private?
          </label>
        </div>

        <Button type="submit" className="bg-black text-white rounded-md">
          Create
        </Button>
      </form>
    </Container>
  );
}

export default CreateShelf;
