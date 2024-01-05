import {
  AppInitializer,
  el,
  MaterialIconSystem,
  Router,
  SplashLoader,
} from "@common-module/app";
import {
  AuthUtil,
  msg,
  SocialComponent,
  TestChatView,
  TestPostListView,
  TestPostView,
} from "@common-module/social";
import messages_en from "../locales/en.yml";
import messages_ja from "../locales/ja.yml";
import messages_zh from "../locales/zh.yml";
import messages_zh_HK from "../locales/zh_HK.yml";
import messages_zh_TW from "../locales/zh_TW.yml";
import SubjectChatRoomView from "./chat-subject/SubjectChatRoomView.js";
import TopicChatRoomView from "./chat-topic/TopicChatRoomView.js";
import ChatsView from "./chat/ChatsView.js";
import Config from "./Config.js";
import EnvironmentManager from "./EnvironmentManager.js";
import HomeView from "./home/HomeView.js";
import Layout from "./layout/Layout.js";
import PostView from "./post/PostView.js";
import ProfileView from "./settings/ProfileView.js";
import SettingsView from "./settings/SettingsView.js";
import IglooSignedUserManager from "./user/IglooSignedUserManager.js";
import UserView from "./user/UserView.js";
import WalletManager from "./wallet/WalletManager.js";

msg.setMessages({
  en: messages_en,
  zh: messages_zh,
  "zh-tw": messages_zh_TW,
  "zh-hk": messages_zh_HK,
  ja: messages_ja,
});

SocialComponent.loadMessages();
MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  EnvironmentManager.messageForWalletLinking = config.messageForWalletLinking;

  WalletManager.init(config.walletConnectProjectId);

  await SplashLoader.load(el("img", { src: "/images/igloo-character.png" }), [
    IglooSignedUserManager.fetchUserOnInit(),
  ]);

  Router.route("**", Layout, ["test/**"]);
  Router.route("", HomeView);
  Router.route(["chats", "chat/{topic}"], ChatsView);
  Router.route("chat/0x{subject}", SubjectChatRoomView);
  Router.route(["chats", "chat/{topic}"], TopicChatRoomView, [
    "chat/0x{subject}",
  ]);
  Router.route("post/{postId}", PostView);
  Router.route("profile", ProfileView);
  Router.route("settings", SettingsView);

  Router.route("{xUsername}", UserView, [
    "chats",
    "chat/{topic}",
    "explore",
    "search",
    "notifications",
    "profile",
    "settings",
    "post/{postId}",
    "{xUsername}/holdings",
    "{xUsername}/holders",
    "{xUsername}/following",
    "{xUsername}/followers",
  ]);

  Router.route("test/chat", TestChatView);
  Router.route("test/posts", TestPostListView);
  Router.route("test/post", TestPostView);

  AuthUtil.checkEmailAccess();
}
