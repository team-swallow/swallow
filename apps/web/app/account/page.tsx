import type { JwtPayload } from "@supabase/supabase-js";

import AccountForm from "@/components/account/account-form";
import { requireAuth } from "@/lib/auth";

export default async function AccountPage() {
  const claims: JwtPayload = await requireAuth();

  return <AccountForm claims={claims} />;
}
