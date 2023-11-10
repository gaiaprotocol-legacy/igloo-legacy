import {
  DomNode,
  LottieAnimation
} from "common-app-module";
import animationData from "./igloo-lottie-animation.json" assert {
  type: "json"
};

export default class IglooLottieAnimation extends DomNode {
  constructor() {
    super(".igloo-lottie-animation");
    this.append(new LottieAnimation(animationData));
  }
}
