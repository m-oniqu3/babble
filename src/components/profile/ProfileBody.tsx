import ProfileBodyHeader from "@/src/components/profile/ProfileBodyHeader";
import ShelvesLayout from "@/src/components/shelf /ShelvesLayout";

type Props = {
  activeProfileID: string;
  currentUser: string;
};

function ProfileBody(props: Props) {
  const { currentUser, activeProfileID } = props;

  return (
    <div>
      <ProfileBodyHeader />

      <ShelvesLayout
        currentUser={currentUser}
        activeProfileID={activeProfileID}
      />
    </div>
  );
}

export default ProfileBody;
