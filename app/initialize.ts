import { el, msg, Router, SplashScreen, Supabase } from "common-dapp-module";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import ChatsView from "./chat/ChatsView.js";
import SubjectChatRoomView from "./chat/SubjectChatRoomView.js";
import TopicChatRoomView from "./chat/TopicChatRoomView.js";
import Config from "./Config.js";
import IglooSubjectContract from "./contracts/IglooSubjectContract.js";
import EnvironmentManager from "./EnvironmentManager.js";
import ExploreView from "./explore/ExploreView.js";
import HomeView from "./HomeView.js";
import Layout from "./layout/Layout.js";
import NotificationsView from "./notification/NotificationsView.js";
import PostCacher from "./post/PostCacher.js";
import PostView from "./post/PostView.js";
import SettingsView from "./settings/SettingsView.js";
import SubjectDetailsCacher from "./subject/SubjectDetailsCacher.js";
import FollowersView from "./user/FollowersView.js";
import FollowingView from "./user/FollowingView.js";
import HoldersView from "./user/HoldersView.js";
import SignedUserManager from "./user/SignedUserManager.js";
import UserDetailsCacher from "./user/UserDetailsCacher.js";
import UserView from "./user/UserView.js";
import UserWalletLinker from "./user/UserWalletLinker.js";
import WalletManager from "./user/WalletManager.js";

dayjs.extend(relativeTime);

export default async function initialize(config: Config) {
  EnvironmentManager.dev = config.dev;
  EnvironmentManager.avaxRpc = config.avaxRpc;
  EnvironmentManager.avaxChainId = config.avaxChainId;

  if (sessionStorage.__spa_path) {
    Router.goNoHistory(sessionStorage.__spa_path);
    sessionStorage.removeItem("__spa_path");
  }

  Supabase.connect(config.supabaseUrl, config.supabaseAnonKey);
  [UserDetailsCacher, SubjectDetailsCacher, PostCacher].forEach((cacher) =>
    cacher.init()
  );
  WalletManager.init(config.walletConnectProjectId);
  UserWalletLinker.init(config.messageForWalletLinking);
  IglooSubjectContract.init(config.iglooSubjectAddress);

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
  Router.route(["chats", "chats/{topic}"], ChatsView);
  Router.route("chats/0x{walletAddress}", SubjectChatRoomView);
  Router.route(["chats", "chats/{topic}"], TopicChatRoomView, [
    "chats/0x{walletAddress}",
  ]);
  Router.route("explore", ExploreView);
  Router.route("notifications", NotificationsView);
  Router.route("settings", SettingsView);
  Router.route("post/{postId}", PostView);

  Router.route("{xUsername}", UserView, [
    "chats",
    "explore",
    "notifications",
    "settings",
    "post/{postId}",
    "{xUsername}/holders",
    "{xUsername}/following",
    "{xUsername}/followers",
  ]);

  Router.route("{xUsername}/holders", HoldersView, ["post/{postId}"]);
  Router.route("{xUsername}/following", FollowingView, ["post/{postId}"]);
  Router.route("{xUsername}/followers", FollowersView, ["post/{postId}"]);
}
