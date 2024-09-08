"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("login user");
  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const randomNumber = Math.floor(Math.random() * 10000);

  const username = `${data.email.split("@")[0]}${randomNumber}`;

  console.log(data);
  const { error, data: userData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username,
        firstname: data.email.split("@")[0],
      },
    },
  });

  if (error) {
    console.log("signin error", error);
    redirect("/error");
  }

  if (!userData || !userData.user) {
    console.log("no user data from signup");
    redirect("/error");
  }

  revalidatePath("/", "layout");

  redirect("/");
}

export async function logout() {
  console.log("logging out");
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
