function answerEvent(repeat) {
  $(".ans_list .answer").on("click touchstart", function () {
    const answer = $(".ans_list").attr("data-correct-answer");
    const cor_answer = $(".ans_list .answer").filter((idx, item) => $(item).attr("data-answer") === answer);
    const btn_answer = $(this).attr("data-answer");

    if (!repeat) {
      repeat++;
      if (answer === btn_answer) {
        playAudio(cor_audio, audioCache);
        $(".left_char img").attr("src", "./img/en/left_char_cor.png");
        $(".right_char img").attr("src", "./img/en/right_char_cor.png");
        $(".bg-content").addClass("active");
        cor_answer.addClass("success");
      } else {
        playAudio(incor_audio, audioCache);
        $(".left_char img").attr("src", "./img/en/left_char_incor.png");
        $(".right_char img").attr("src", "./img/en/right_char_incor.png");
        cor_answer.addClass("fail");
        $(this).addClass("select");
      }

      $(".ans_list").addClass("active");
    }
  });
}

function quizAudioEvent(repeat) {
  $(".quiz_content .sound").on("click touchstart", function () {
    let sound_src = $(this).attr("data-sound-src");
    playAudio(sound_src, audioCache);

    let path = "../audio/";
    audioCache[path + sound_src].addEventListener("ended", function () {
      $(".quiz_content .sound").addClass("remove");
      $(".quiz_content .add_text").addClass("active");
      answerEvent(repeat);
    });
  });
}

let audioCache = {};

$(document).ready(function () {
  wrapContents();
  window.addEventListener("resize", resizer);
  window.addEventListener("DOMContentLoaded", resizer);

  let answerRepeat = 0;
  quizAudioEvent(answerRepeat);
  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("6f33e8"));
});
