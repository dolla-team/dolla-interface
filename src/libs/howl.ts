import { Howl } from "howler";

const flipSound = new Howl({
  src: ["/btc/flip.mp3"],
  volume: 1,
  loop: false
});

const bgmSound = new Howl({
  src: ["/bgm.mp3"],
  volume: 0.1,
  loop: true,
  preload: true,
  autoplay: false
});

const bidSuccessSound = new Howl({
  src: ["/audios/winning.mp3"],
  volume: 0.1,
  loop: false
});

const coinSound = new Howl({
  src: ["/audios/coin-drop.mp3"],
  volume: 1,
  loop: false
});

const prevAnimationSound = new Howl({
  src: ["/audios/prev-animation.m4a"],
  volume: 0.5,
  loop: true
});

window.howl = {
  flip: flipSound,
  bgm: bgmSound,
  coinDrop: coinSound,
  bidSuccess: bidSuccessSound,
  prevAnimation: prevAnimationSound
};
