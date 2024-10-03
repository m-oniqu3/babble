import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getUsers() {
  const supabase = createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase.from("profiles").select("username");

  if (error || !data) return;

  return data;
}

async function page() {
  const users = await getUsers();

  return (
    <div className="wrapper">
      <h1 className="text-lg py-4">Users</h1>

      <ul>
        {users?.map((user) => (
          <li key={user.username}>
            <Link href={`/profile/${user.username}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default page;
