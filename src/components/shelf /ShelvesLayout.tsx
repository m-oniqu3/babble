import { getShelves } from "@/src/app/utils/shelves";

type Props = {
  currentUser: string;
  activeProfileID: string;
};

async function ShelvesLayout(props: Props) {
  const { currentUser, activeProfileID } = props;

  const shelves = await getShelves(activeProfileID);

  if (!shelves) {
    return <p>Shelves not found</p>;
  }

  return <div>ShelvesLayout</div>;
}

export default ShelvesLayout;
