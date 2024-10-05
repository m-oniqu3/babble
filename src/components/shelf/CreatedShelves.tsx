import DisplayCreatedShelves from "@/src/components/shelf/DisplayCreatedShelves";
import { getProfile } from "@/src/utils/profile";
import { getShelves } from "@/src/utils/shelves";
import { createClient } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  URLProfileUsername: string;
};

async function getCurrentUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }
  return data.user.id;
}

async function CreatedShelves({ URLProfileUsername }: Props) {
  const profile = await getProfile(URLProfileUsername);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const queryClient = new QueryClient();
  const supabase = createClient();

  const prefetchPromise = queryClient.prefetchInfiniteQuery({
    queryKey: ["shelves", profile.user_id],
    queryFn: ({ pageParam }) =>
      getShelves(supabase, pageParam, profile.user_id),
    initialPageParam: 0,
  });

  // promise.all to get user and prefetch promise
  // the prefetch promise doesn't return anything
  const [_, authUserID] = await Promise.all([
    prefetchPromise,
    getCurrentUser(),
  ]);

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
