import { useEffect, useRef } from "react";

interface Props {
  closeMenu: () => void;
}

export default function useDetectClickOutside<T extends HTMLElement>(
  props: Props
) {
  const { closeMenu } = props;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function detectClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) closeMenu();
    }

    document.addEventListener("mousedown", detectClick);

    return () => document.removeEventListener("mousedown", detectClick);
  }, [closeMenu]);

  return ref;
}
