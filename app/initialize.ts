import { el, msg, Router, SplashScreen } from "common-dapp-module";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import Config from "./Config.js";
import EnvironmentManager from "./EnvironmentManager.js";
import Layout from "./Layout.js";

dayjs.extend(relativeTime);

export default async function initialize(config: Config) {
  EnvironmentManager.dev = config.dev;

  if (sessionStorage.__spa_path) {
    Router.goNoHistory(sessionStorage.__spa_path);
    sessionStorage.removeItem("__spa_path");
  }

  const splash = new SplashScreen(
    el("img", { src: "/images/igloo-character.png" }),
  );
  await Promise.all([
    msg.loadYAMLs({
      en: ["/locales/en.yml"],
    }),
  ]);
  splash.delete();

  Router.route("**", Layout);
}
