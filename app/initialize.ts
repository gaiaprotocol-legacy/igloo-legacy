import {
  AppInitializer,
  el,
  MaterialIconSystem,
  msg,
  Router,
  SplashLoader,
} from "common-app-module";
import { SocialComponent } from "sofi-module";
import messages_en from "../locales/en.yml";
import messages_ja from "../locales/ja.yml";
import messages_zh from "../locales/zh.yml";
import messages_zh_HK from "../locales/zh_HK.yml";
import messages_zh_TW from "../locales/zh_TW.yml";
import Config from "./Config.js";
import HomeView from "./home/HomeView.js";
import Layout from "./layout/Layout.js";
import SettingsView from "./settings/SettingsView.js";
import SignedUserManager from "./user/SignedUserManager.js";

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

  await SplashLoader.load(el("img", { src: "/images/igloo-character.png" }), [
    SignedUserManager.fetchUserOnInit(),
  ]);

  Router.route("**", Layout);
  Router.route("", HomeView);
  Router.route("settings", SettingsView);
}
