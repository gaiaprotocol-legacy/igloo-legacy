import { ethers } from "https://esm.sh/ethers@6.7.0";
import { serveWithOptions } from "../_shared/cors.ts";
import supabase, { getSignedUser } from "../_shared/supabase.ts";

serveWithOptions(async (req) => {
  const { walletAddress, signedMessage } = await req.json();
  if (!walletAddress || !signedMessage) {
    throw new Error("Missing wallet address or signed message");
  }

  const user = await getSignedUser(req);
  if (!user) throw new Error("Unauthorized");

  const { data: nonceDataSet, error: nonceError } = await supabase.from(
    "wallet_linking_nonces",
  ).select().eq("user_id", user.id);
  if (nonceError) throw nonceError;

  const nonceData = nonceDataSet?.[0];
  if (!nonceData) throw new Error("Nonce not found");
  if (nonceData.wallet_address !== walletAddress) {
    throw new Error("Invalid wallet address");
  }

  const verifiedAddress = ethers.verifyMessage(
    `${
      Deno.env.get("MESSAGE_FOR_WALLET_LINKING")
    }\n\nNonce: ${nonceData.nonce}`,
    signedMessage,
  );
  if (walletAddress !== verifiedAddress) throw new Error("Invalid signature");

  // delete old nonce
  await supabase.from("wallet_linking_nonces").delete().eq("user_id", user.id);

  const { error: deleteWalletAddressError } = await supabase.from(
    "user_details",
  ).update(
    { wallet_address: null },
  ).eq("wallet_address", walletAddress);
  if (deleteWalletAddressError) throw deleteWalletAddressError;

  // deno-lint-ignore no-explicit-any
  const metadata: any = {};
  if (user.app_metadata.provider === "twitter") {
    metadata.xUsername = user.user_metadata.user_name;
  }

  const { error: setWalletAddressError } = await supabase
    .from("user_details")
    .upsert({
      user_id: user.id,
      wallet_address: walletAddress,
      display_name: user.user_metadata.full_name,
      profile_image: user.user_metadata.avatar_url,
      metadata,
    }).eq("user_id", user.id);
  if (setWalletAddressError) throw setWalletAddressError;
});
