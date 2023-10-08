import { SplashScreen, el } from "common-dapp-module";
import Config from "./Config.js";

export default async function initialize(config: Config) {
  const splash = new SplashScreen(
    el("img", { src: "/images/igloo-character.png" }),
  );
}
