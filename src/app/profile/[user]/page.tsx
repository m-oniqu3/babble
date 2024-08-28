type Props = {
  params: { user: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function ProfilePage({ params, searchParams }: Props) {
  if (!params.user) {
    return <p>Profile not found</p>;
  }

  const user = params.user;
  const page = "page" in searchParams ? (searchParams.page as string) : null;

  return (
    <div>
      <p> User is {user}</p>
      <p>Selected page is {page ? page : "default created page"}</p>
    </div>
  );
}

export default ProfilePage;
