import {
  AppInitializer,
  AuthUtil,
  el,
  MaterialIconSystem,
  Router,
  SplashLoader,
} from "@common-module/app";
import {
  ESFEnv,
  ESFSignedUserManager,
  SettingsView,
  UnifiedWalletManager,
  WalletConnectManager,
} from "esf-module";
import {
  ActivityView,
  Blockchains,
  BlockTimeManager,
  ChatsView,
  ExploreView,
  GeneralChatRoomView,
  HESFEnv,
  HESFLayout,
  inject_hesf_msg,
  KeyChatRoomView,
  ProfileView,
  UserView,
} from "hesf";
import { avalanche, avalancheFuji } from "viem/chains";
import AboutView from "./AboutView.js";
import Config from "./Config.js";
import ConnectWalletPopup from "./ConnectWalletPopup.js";
import Env from "./Env.js";
import ParticleAuthManager from "./ParticleAuthManager.js";

inject_hesf_msg();

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.dev = config.dev;

  ESFEnv.domain = "igloo.ax";
  ESFEnv.keyName = "ice";
  ESFEnv.messageForWalletLinking = "Link Wallet to Igloo";
  ESFEnv.Layout = HESFLayout;

  HESFEnv.keyContractAddresses.avalanche = config.dev
    ? "0x5f084433645A32bEaACed7Ac63A747b7d507614D"
    : "";

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  const avax = config.dev ? avalancheFuji : avalanche;

  WalletConnectManager.init(config.walletConnectProjectId, [avax]);
  ParticleAuthManager.init({
    projectId: "c0b83e57-84a2-4918-bbe2-24cafea056bf",
    clientKey: "cJ5m8ABRUPq0C1axiu220WS1RPwpIYt4jrGrhRsB",
    appId: "eb1bbb74-421f-499a-bfbc-b64876e7297b",
  });

  UnifiedWalletManager.wallets.push(ParticleAuthManager);
  UnifiedWalletManager.openConnectPopup = async () =>
    await (new ConnectWalletPopup()).wait();

  Blockchains.avalanche = {
    chainId: avax.id,
    name: avax.name,
    symbolDisplay: "AVAX",
    icon: "/images/avax-symbol.svg",
    rpc: avax.rpcUrls.default.http[0],
    blockExplorer: avax.blockExplorers.default,
    blockTime: 2,
  };

  await SplashLoader.load(el("img", { src: "/images/logo-transparent.png" }), [
    ESFSignedUserManager.fetchUserOnInit(),
    BlockTimeManager.init(),
  ]);

  Router.route("**", HESFLayout);
  Router.route(["", "about"], AboutView);

  Router.route(["explore", "explore/{type}"], ExploreView);
  Router.route("activity", ActivityView);
  Router.route("profile", ProfileView);
  Router.route("settings", SettingsView);

  Router.route(["chats", "general", "{chain}/{keyId}"], ChatsView, [
    "explore/{type}",
    "{xUsername}/holding",
    "{xUsername}/following",
    "{xUsername}/followers",
  ]);
  Router.route(["chats", "general"], GeneralChatRoomView);
  Router.route("{chain}/{keyId}", KeyChatRoomView, [
    "explore/{type}",
    "{xUsername}/holding",
    "{xUsername}/following",
    "{xUsername}/followers",
  ]);

  Router.route("{xUsername}", UserView, [
    "about",
    "explore",
    "activity",
    "profile",
    "settings",
    "chats",
    "general",
  ]);

  AuthUtil.checkEmailAccess();
}
