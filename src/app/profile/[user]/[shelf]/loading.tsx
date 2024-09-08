export default function Loading() {
  return (
    <div className="wrapper flex flex-col gap-2 items-center justify-center text-center my-4 max-w-sm">
      {/* <!-- name --> */}
      <div className="h-8 w-36 bg-neutral-200 rounded-sm" />

      {/* <!-- username --> */}
      <div className="h-3 w-20 bg-neutral-200 rounded-sm" />

      {/* <!-- bio --> */}
      <div className="h-3 w-full bg-neutral-200 rounded-sm" />
      <div className="h-3 w-44 bg-neutral-200 rounded-sm" />

      {/* <!-- followers --> */}
      <div className="flex gap-2 items-center">
        <div className="h-5 w-24 bg-neutral-200 rounded-sm" />
        <div className="h-5 w-20 bg-neutral-200 rounded-sm" />
      </div>

      {/* <!-- buttons --> */}
      <div className="flex gap-2 items-center">
        <div className="h-11 w-20 bg-neutral-200 rounded-full" />
        <div className="h-11 w-28 bg-neutral-200 rounded-full" />
      </div>
    </div>
  );
}
// export default function Loading() {
//   return null;
// }
