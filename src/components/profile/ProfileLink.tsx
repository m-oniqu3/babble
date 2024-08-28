"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

async function getUserName(userID: string) {
  const supabase = createClient();

  console.log("userID", userID);

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", userID)
    .single();

  if (profileError) {
    console.error("profileError", profileError);
    return;
  }

  if (!profileData) {
    console.error("profileData not found");
    return;
  }

  return profileData.username;
}

function ProfileLink() {
  const [userID, setUserID] = useState<string>("");

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    async function fetchUserID() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        return;
      }
      setUserID(data.user.id);
    }

    fetchUserID();
  }, []);

  // when the userID changes, fetch the username
  useEffect(() => {
    if (!userID) {
      return;
    }
    async function fetchUsername() {
      const username = await getUserName(userID);

      if (!username) {
        return;
      }
      setUsername(username);
    }
    fetchUsername();
  }, [userID]);

  return <Link href={`/profile/${username}`}>Profile</Link>;
}

export default ProfileLink;
