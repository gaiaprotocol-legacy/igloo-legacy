import initialize from "./initialize.js";
await initialize({
  dev: true,

  supabaseUrl: "https://wtqgbkbewlhfloiscjli.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cWdia2Jld2xoZmxvaXNjamxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5NjE2NzEsImV4cCI6MjAxNzUzNzY3MX0.CAmMN8hoDubTCz8E73BF9qKpKFBFumdpwjjbIcQMjVQ",

  walletConnectProjectId: "53ce7f51ed886a719bf634b25061f424",
});
