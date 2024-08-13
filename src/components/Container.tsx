import React from "react";

type Props = {
  children: React.ReactNode;
};

function Container({ children }: Props) {
  return (
    <div className="w-full bg-white p-4 max-w-md mx-auto rounded-lg">
      {children}
    </div>
  );
}

export default Container;
