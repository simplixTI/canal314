import { createClient } from "@/lib/supabase/server";
import { getCoinBalance, getUser } from "@/lib/data";
import HeaderShell from "./HeaderShell";

export default async function Header() {
  const supabase = await createClient();
  const user = supabase ? await getUser(supabase) : null;
  const coinBalance =
    supabase && user ? await getCoinBalance(supabase, user.id) : null;
  const userInitial = user?.email?.charAt(0).toUpperCase() ?? null;
  return (
    <HeaderShell
      loggedIn={Boolean(user)}
      coinBalance={coinBalance}
      userInitial={userInitial}
    />
  );
}
