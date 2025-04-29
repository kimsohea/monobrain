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
