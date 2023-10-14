import initialize from "./initialize.js";
await initialize({
  dev: true,

  /*
  supabaseUrl: "http://localhost:54321",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
  */
  supabaseUrl: "https://diffcrvgnspbzzbqwtvt.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZmZjcnZnbnNwYnp6YnF3dHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY3MzU2MjIsImV4cCI6MjAxMjMxMTYyMn0.CtVuTA_yY1t6zQ4NUZJUWEp7aDG2JBpR_6SFdU3vNJg",

  walletConnectProjectId: "53ce7f51ed886a719bf634b25061f424",
  messageForWalletLinking: "Link Wallet to Igloo",

  avaxRpc: "https://api.avax.network/ext/bc/C/rpc",
  avaxChainId: 43114,

  iglooSubjectAddress: "0xa6940B0A43B4832dbfD6Db8a57bb441B905D6dAC",
});
