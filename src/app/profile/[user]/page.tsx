import CreatedShelves from "@/src/components/shelf /CreatedShelves";

type Props = {
  params: { user: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function ProfilePage({ params, searchParams }: Props) {
  if (!params.user) {
    return <p>Profile not found</p>;
  }

  const page = "view" in searchParams ? (searchParams.view as string) : null;

  function switchPage(page: string | null) {
    switch (page) {
      case "created":
        return <CreatedShelves URLProfileUsername={params.user} />;
      case "saved":
        return <p>Saved page</p>;
      default:
        return <CreatedShelves URLProfileUsername={params.user} />;
    }
  }

  return <div>{switchPage(page)}</div>;
}

export default ProfilePage;
