import DisplayCreatedShelves from "@/src/components/shelf/DisplayCreatedShelves";
import { getProfile } from "@/src/utils/profile";
import { getCreatedShelves } from "@/src/utils/shelves";
import { getCurrentUser } from "@/src/utils/user/get-current-user";
import { createClient } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  URLProfileUsername: string;
};

async function CreatedShelves({ URLProfileUsername }: Props) {
  const profile = await getProfile(URLProfileUsername);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const queryClient = new QueryClient();
  const supabase = createClient();

  const authUserID = await getCurrentUser(supabase);

  queryClient.prefetchInfiniteQuery({
    queryKey: ["created-shelves", profile.user_id],
    queryFn: ({ pageParam }) =>
      getCreatedShelves(supabase, pageParam, profile.user_id, authUserID),
    initialPageParam: 0,
  });

  const isAuthUser = authUserID === profile.user_id;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DisplayCreatedShelves
        isAuthUser={isAuthUser}
        URLProfileID={profile.user_id}
        authUserID={authUserID}
      />
    </HydrationBoundary>
  );
}

export default CreatedShelves;
