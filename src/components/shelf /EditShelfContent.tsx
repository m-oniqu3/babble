"use client";

import { AddIcon, CloseIcon } from "@/src/components/icons";

type Props = {};

function EditShelfContent({}: Props) {
  return (
    <div>
      {" "}
      <header className="relative mb-4">
        <h1 className="text-lg font-semibold">Edit Shelf</h1>
        <p className="text-xs font-light">Customize your shelf.</p>

        <button onClick={close} className="absolute top-0 right-0">
          <CloseIcon className="w-5 h-5" />
        </button>
      </header>
      <form className="space-y-4">
        <div>
          <label htmlFor="cover" className="text-xs font-light">
            Shelf Cover
          </label>
          <button
            type="button"
            // onClick={() => imageRef.current?.click()}
            className="bg-slate-100 h-28 w-28 flex rounded-md
                items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <AddIcon />
          </button>
          <input
            // {...form.register("cover")}
            // ref={imageRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            // onChange={handleImageChange}
            className="hidden"
          />

          {/* <p className="input-error">{form.formState.errors.cover?.message}</p> */}
        </div>

        {/* name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-light">
            Shelf Name
          </label>
          <input
            // {...form.register("name")}
            className="bg-slate-100 font-light text-xs h-9 w-full rounded-md px-2 focus:outline-none placeholder:text-xs placeholder:font-light"
            placeholder="romance"
          />

          {/* <p className="input-error">{form.formState.errors.name?.message}</p> */}
        </div>

        {/* description */}
        <div className="space-y-1">
          <label htmlFor="description" className="text-xs font-light">
            What is this shelf about?
          </label>
          <textarea
            // {...form.register("description")}
            className="bg-slate-100 font-light text-xs h-20 w-full rounded-md p-2 focus:outline-none placeholder:text-xs placeholder:font-light resize-none"
            placeholder="books that had me giggling & kicking my feet at 3 am."
          ></textarea>

          {/* <p className="input-error">
            {form.formState.errors.description?.message}
          </p> */}
        </div>

        {/* private */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            //{...form.register("private")}
            id="private"
            className="h-4 w-4 accent-slate-200"
          />
          <label htmlFor="private" className="text-xs font-light h-full mt-0!">
            Is this shelf private?
          </label>

          {/* <p className="input-error">
            {form.formState.errors.private?.message}
          </p> */}
        </div>
      </form>
    </div>
  );
}

export default EditShelfContent;
