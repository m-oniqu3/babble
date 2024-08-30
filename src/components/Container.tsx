import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function Container({ children, className }: Props) {
  return (
    <div
      className={`w-full bg-white p-4 max-w-md mx-auto rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default Container;
