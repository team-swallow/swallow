import AccountForm from "@/components/account/account-form";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();

  return <AccountForm claims={claimsData?.claims ?? null} />;
}
