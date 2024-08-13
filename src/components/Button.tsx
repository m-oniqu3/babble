type Props = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean | undefined;
  onClick?: () => void | undefined;
  style?: React.CSSProperties;
};

function Button(props: Props) {
  return (
    <button
      style={props.style ?? {}}
      type={props.type ?? "button"}
      disabled={props.disabled || false}
      className={`${props.className ?? ""} 
      rounded-lg px-4 h-8 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
