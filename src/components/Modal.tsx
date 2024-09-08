"use client";

import Portal from "@/src/components/Portal";

type Props = {
  children: React.ReactNode;
  close: () => void;
};

function Modal(props: Props) {
  const { children, close } = props;

  return (
    <Portal selector="#modal">
      <div
        className="fixed p-4 w-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={close}
      >
        <>{children}</>
      </div>
    </Portal>
  );
}

export default Modal;
