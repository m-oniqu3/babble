import Link from "next/link";

interface Props {
  children: React.ReactNode;
  className?: string;
  route: string;
}

function ButtonLink(props: Props) {
  const { children, className = "", route } = props;

  return (
    <Link
      href={route}
      className={`${className} px-4 h-8 font-medium text-sm flex items-center`}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;
