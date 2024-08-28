import CreatedShelves from "@/src/components/shelf /CreatedShelves";

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

  function switchPage(page: string | null) {
    switch (page) {
      case "created":
        return <CreatedShelves currentUser={user} />;
      case "saved":
        return <p>Saved page</p>;
      default:
        return <CreatedShelves currentUser={user} />;
    }
  }

  return <div>{switchPage(page)}</div>;
}

export default ProfilePage;
