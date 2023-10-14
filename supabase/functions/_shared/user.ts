import supabase from "./supabase.ts";

export const getUserWalletAddress = async (userId: string) => {
  const { data, error } = await supabase.from("user_details").select(
    "wallet_address",
  ).eq("user_id", userId);
  if (error) throw error;
  return data?.[0]?.wallet_address;
};
