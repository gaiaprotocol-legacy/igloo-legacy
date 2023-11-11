import initialize from "./initialize.js";
await initialize({
  dev: false,
  supabaseUrl: "https://gslqborrkoraysvsopjv.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbHFib3Jya29yYXlzdnNvcGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgwMzM0MjksImV4cCI6MjAxMzYwOTQyOX0.A1pCWncoOjXlpT73mH5tFJjpbBEuPMVGBXmVIig_jhQ",
  walletConnectProjectId: "53ce7f51ed886a719bf634b25061f424",
  messageForWalletLinking: "Link Wallet to Igloo",
});
