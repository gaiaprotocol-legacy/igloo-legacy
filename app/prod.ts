import initialize from "./initialize.js";
await initialize({
  dev: false,
  supabaseUrl: "https://diffcrvgnspbzzbqwtvt.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZmZjcnZnbnNwYnp6YnF3dHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY3MzU2MjIsImV4cCI6MjAxMjMxMTYyMn0.CtVuTA_yY1t6zQ4NUZJUWEp7aDG2JBpR_6SFdU3vNJg",
  walletConnectProjectId: "53ce7f51ed886a719bf634b25061f424",
  messageForWalletLinking: "Link Wallet to Igloo",
});
