const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const cor_audio = new Audio("./audio/correct2.mp3");
const incor_audio = new Audio("./audio/incorrect.wav");

const click_audio = new Audio("./audio/click.mp3");

const playAudio = (ado, audioCache, fromZero = true) => {
  // 오디오 경로 없을때
  if (!ado) return;
  // 트랙 0부터 시작
  fromZero = !(fromZero == false || fromZero == "false");

  if (typeof ado === "string") {
    let path = `../audio/${ado}`;
    if (!audioCache[path]) {
      audioCache[path] = new Audio(path);
      audioCache[path].load();
    }
    ado = audioCache[path];
  }

  if (fromZero) ado.currentTime = 0;
  if (!ado.paused) return;

  ado.pause();
  ado.play()?.catch(console.log);

  return ado;
};

let cache = null;

const Sound = {
  play: function (url, timer, func) {
    audioContext.resume().then(() => {
      if (cache) {
        try {
          cache.stop();
        } catch (e) {
          console.warn("이전 소스를 중지하는 중 오류 발생:", e);
        }
        cache.disconnect();
        cache = null;
      }

      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((data) => audioContext.decodeAudioData(data))
        .then((buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          if (timer !== undefined && timer.length === 0) {
            timer.push(source.buffer.duration);
            setTimeout(() => func(), source.buffer.duration * 1000);
          }
          cache = source;
          source.onended = () => {
            if (cache === source) cache = null;
          };
        })
        .catch((err) => console.error("Audio playback failed:", err));
    });
  },
  click: function () {
    this.play("audio/click.mp3");
  },
  correct: function () {
    this.play("audio/correct.mp3");
  },
  incorrect: function () {
    this.play("audio/incorrect.mp3");
  },
  runnyNose: function (timer, func) {
    this.play("audio/runny_nose.mp3", timer, func);
  },
  france: function (timer, func) {
    this.play("audio/france.mp3", timer, func);
  },
  spell: function (timer, func) {
    this.play("audio/how_do_you_spell_your_name.mp3", timer, func);
  },
};
