import {
  AppInitializer,
  AuthUtil,
  el,
  MaterialIconSystem,
  Router,
  SplashLoader,
} from "@common-module/app";
import {
  BlockTimeManager,
  Env,
  HESFLayout,
  HESFSignedUserManager,
  inject_hesf_msg,
  WalletManager,
} from "hesf";
import { avalanche, avalancheFuji } from "viem/chains";
import AboutView from "./AboutView.js";
import Config from "./Config.js";

inject_hesf_msg();

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.domain = "igloo.ax";
  Env.keyName = "ice";
  Env.messageForWalletLinking = "Link Wallet to Igloo";

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  WalletManager.init(config.walletConnectProjectId, [
    config.dev ? avalancheFuji : avalanche,
  ]);

  await SplashLoader.load(el("img", { src: "/images/logo-transparent.png" }), [
    HESFSignedUserManager.fetchUserOnInit(),
    BlockTimeManager.init(),
  ]);

  Router.route("**", HESFLayout);

  Router.route(["", "about"], AboutView);

  AuthUtil.checkEmailAccess();
}
