import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function Container({ children, className, style }: Props) {
  return (
    <div
      className={`w-full bg-white p-4 max-w-md mx-auto rounded-lg ${className}`}
      style={style || {}}
    >
      {children}
    </div>
  );
}

export default Container;
