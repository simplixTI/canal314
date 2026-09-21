import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/data";
import HeaderShell from "./HeaderShell";

export default async function Header() {
  const supabase = await createClient();
  const user = supabase ? await getUser(supabase) : null;
  return <HeaderShell loggedIn={Boolean(user)} />;
}
