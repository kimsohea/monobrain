function answerEvent(repeat) {
  $(".ans_list .answer").on("click touchstart", function () {
    const answer = $(".ans_list").attr("data-correct-answer");
    const cor_answer = $(".ans_list .answer").filter((idx, item) => $(item).attr("data-answer") === answer);
    const btn_answer = $(this).attr("data-answer");

    if (!repeat) {
      repeat++;
      if (answer === btn_answer) {
        Sound.correct();
        $(".left_char img").attr("src", "./img/en/left_char_cor.png");
        $(".right_char img").attr("src", "./img/en/right_char_cor.png");
        $(".bg-content").addClass("active");
        cor_answer.addClass("success");
      } else {
        Sound.incorrect();
        $(".left_char img").attr("src", "./img/en/left_char_incor.png");
        $(".right_char img").attr("src", "./img/en/right_char_incor.png");
        cor_answer.addClass("fail");
        $(this).addClass("select");
      }

      $(".ans_list").addClass("active");
    }
  });
}

function quizAudioEvent() {
  $(".quiz_content .sound").on("click touchstart", function () {
    if (timerRepeat === 0) {
      timerRepeat++;
      Sound.spell(timer, endFunc);
    }
  });
}

function endFunc() {
  $(".quiz_content .sound").addClass("remove");
  $(".quiz_content .add_text").addClass("active");
  answerEvent(answerRepeat);
}

let timer = [];
let answerRepeat = 0;
let timerRepeat = 0;

$(document).ready(function () {
  wrapContents();
  window.addEventListener("resize", resizer);
  window.addEventListener("DOMContentLoaded", resizer);

  quizAudioEvent();
  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("6f33e8"));
});
