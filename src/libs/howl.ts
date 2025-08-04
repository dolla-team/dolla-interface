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

window.howl = {
  flip: flipSound,
  bgm: bgmSound
};
