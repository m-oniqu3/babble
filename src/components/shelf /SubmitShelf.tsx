"use client";

import Button from "@/src/components/Button";
import { useFormStatus } from "react-dom";

type Props = {};

function SubmitShelf({}: Props) {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        disabled={pending}
        type="submit"
        className="bg-black text-white rounded-md"
      >
        Create
      </Button>
    </>
  );
}

export default SubmitShelf;
