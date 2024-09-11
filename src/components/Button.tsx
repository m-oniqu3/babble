type Props<T extends (...args: any) => any> = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean | undefined;
  onClick?: T | undefined;
  style?: React.CSSProperties;
};

function Button<T extends (...args: any) => any>(props: Props<T>) {
  return (
    <button
      style={props.style ?? {}}
      type={props.type ?? "button"}
      disabled={props.disabled || false}
      className={`
      rounded-md px-4 h-8 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        props.className ?? ""
      } `}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
