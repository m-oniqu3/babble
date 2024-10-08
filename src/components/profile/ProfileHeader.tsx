import Button from "@/src/components/Button";
import { LogoIcon } from "@/src/components/icons";
import { Profile } from "@/src/types/profile";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

type Props = {
  profile: Profile;
  currentUser: User["id"] | null;
};

function ProfileHeader({ profile, currentUser }: Props) {
  const isCurrentUser = profile.user_id === currentUser;
  return (
    <header className="wrapper flex flex-col gap-2 items-center text-center my-4 max-w-sm">
      <figure>
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt="avatar"
            className="h-[7.5rem] w-[7.5rem] object-cover rounded-full "
            width={150}
            height={150}
          />
        ) : (
          <div className="h-[7.5rem] w-[7.5rem] bg-gray-200 rounded-full font-semibold flex items-center justify-center text-4xl">
            {profile.username.slice(0, 2).toUpperCase()}
          </div>
        )}
      </figure>

      <h1 className="font-semibold text-2xl text-black sm:text-3xl">
        {profile.firstname + " " + profile.lastname}
      </h1>

      <p className="space-x-2 text-sm flex flex-col">
        <span className="font-semibold">{profile.username}@gmail.com</span>
        {profile.bio && <span>{profile.bio}</span>}
      </p>

      <div className="flex gap-1 items-center ">
        <LogoIcon className="text-zinc-600 size-5" />
        <p className="text-sm lowercase text-zinc-600">{profile.username}</p>
      </div>

      <div className="flex gap-2 items-center ">
        <p className="text-sm font-medium">12k followers</p>
        <p className="text-sm font-medium">3k following</p>
      </div>

      <div className="flex gap-2 items-center">
        {!isCurrentUser && (
          <Button className="h-9 font-medium text-white bg-black ">
            Follow
          </Button>
        )}

        {isCurrentUser && (
          <Button className="h-9 font-medium text-white bg-black ">
            Edit Profile
          </Button>
        )}
      </div>
    </header>
  );
}

export default ProfileHeader;
