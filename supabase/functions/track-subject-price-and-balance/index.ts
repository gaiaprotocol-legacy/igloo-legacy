import { serveWithOptions } from "../_shared/cors.ts";
import { getSignedUser } from "../_shared/supabase.ts";
import { getUserWalletAddress } from "../_shared/user.ts";

serveWithOptions(async (req) => {
  const { subjects } = await req.json();
  if (!subjects) throw new Error("Missing subjects");

  const user = await getSignedUser(req);
  if (!user) throw new Error("Unauthorized");

  const walletAddress = await getUserWalletAddress(user.id);
  if (!walletAddress) throw new Error("No wallet address");
});
