import { el, msg, Router, SplashScreen, Supabase } from "common-dapp-module";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import Config from "./Config.js";
import EnvironmentManager from "./EnvironmentManager.js";
import ExploreView from "./explore/ExploreView.js";
import HomeView from "./HomeView.js";
import InboxView from "./inbox/InboxView.js";
import Layout from "./layout/Layout.js";
import NotificationsView from "./notification/NotificationsView.js";
import PostCacher from "./post/PostCacher.js";
import PostView from "./post/PostView.js";
import SettingsView from "./settings/SettingsView.js";
import SignedUserManager from "./user/SignedUserManager.js";
import UserView from "./user/UserView.js";
import UserWalletLinker from "./user/UserWalletLinker.js";
import WalletManager from "./user/WalletManager.js";

dayjs.extend(relativeTime);

export default async function initialize(config: Config) {
  EnvironmentManager.dev = config.dev;
  EnvironmentManager.avaxRpc = config.avaxRpc;

  if (sessionStorage.__spa_path) {
    Router.goNoHistory(sessionStorage.__spa_path);
    sessionStorage.removeItem("__spa_path");
  }

  Supabase.connect(config.supabaseUrl, config.supabaseAnonKey);
  [PostCacher].forEach((cacher) => cacher.init());
  WalletManager.init(config.walletConnectProjectId);
  UserWalletLinker.init(config.messageForWalletLinking);

  const splash = new SplashScreen(
    el("img", { src: "/images/igloo-character.png" }),
  );
  await Promise.all([
    SignedUserManager.fetchUserOnInit(),
    msg.loadYAMLs({
      en: ["/locales/en.yml"],
    }),
  ]);
  splash.delete();

  Router.route("**", Layout);
  Router.route("", HomeView);
  Router.route("inbox", InboxView);
  Router.route("explore", ExploreView);
  Router.route("notifications", NotificationsView);
  Router.route("settings", SettingsView);
  Router.route("post/{postId}", PostView);

  Router.route("{xUsername}", UserView, [
    "inbox",
    "explore",
    "notifications",
    "settings",
    "post/{postId}",
  ]);
}
