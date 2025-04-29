const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const Sound = {
  play: function (url) {
    audioContext.resume().then(() => {
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((data) => audioContext.decodeAudioData(data))
        .then((buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
        })
        .catch((err) => console.error("Audio playback failed:", err));
    });
  },
  click: function () {
    this.play("audio/click.mp3");
  },
  drag: function () {
    this.play("./audio/drag&drop.mp3");
  },
  correct: function () {
    this.play("audio/correct.mp3");
  },
  incorrect: function () {
    this.play("audio/incorrect.mp3");
  },
  complete: function () {
    this.play("audio/complete_03.mp3");
  },
};
