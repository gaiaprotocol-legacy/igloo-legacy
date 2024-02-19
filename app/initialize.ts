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
  UnifiedWalletManager,
  WalletConnectManager,
} from "esf-module";
import {
  Blockchains,
  BlockTimeManager,
  HESFLayout,
  inject_hesf_msg,
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

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  const avax = config.dev ? avalancheFuji : avalanche;

  WalletConnectManager.init(config.walletConnectProjectId, [avax]);
  UnifiedWalletManager.wallets.push(ParticleAuthManager);
  UnifiedWalletManager.openConnectPopup = async () =>
    await (new ConnectWalletPopup()).wait();

  Blockchains.avalaunch = {
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

  AuthUtil.checkEmailAccess();
}
