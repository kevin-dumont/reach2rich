"use server";

import { createClient } from "@/config/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
};
