import { DomNode, LottieAnimation } from "@common-module/app";
import animationData from "./igloo-loading-animation.json" assert {
  type: "json",
};

export default class IglooLoadingAnimation extends DomNode {
  constructor() {
    super(".igloo-loading-animation");
    this.append(new LottieAnimation(animationData));
  }
}
