import React from "react";

type Props<T extends (...args: any) => any> = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: T;
};

function Container<T extends (...args: any) => any>(props: Props<T>) {
  const { children, className, style, onClick = () => {} } = props;
  return (
    <div
      className={`w-full bg-white p-4 max-w-md mx-auto rounded-lg ${className}`}
      style={style || {}}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Container;
