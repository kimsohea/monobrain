function answerEvent(repeat) {
  $(".ans_list .answer").on("click touchstart", function () {
    const answer = $(".ans_list").attr("data-correct-answer");
    const cor_answer = $(".ans_list .answer").filter((idx, item) => $(item).attr("data-answer") === answer);
    const btn_answer = $(this).attr("data-answer");
    const dir = $(this).attr("data-dir");

    if (!repeat) {
      repeat++;
      if (answer === btn_answer) {
        Sound.correct();
        beeAnimationSuccess(dir);
        cor_answer.addClass("success");
      } else {
        Sound.incorrect();
        beeAnimationFail(dir);
        cor_answer.addClass("fail");
      }

      $(".ans_list").addClass("active");
    }
  });
}

function quizAudioEvent() {
  $(".quiz_content .sound").on("click touchstart", function () {
    if ($(this).hasClass("notice_text")) $(this).removeClass("notice_text");
    Sound.spell(timer, endFunc);
  });
}

function endFunc() {
  $(".ans_list .answer").removeClass("not-active");
  answerEvent(answerRepeat);
}

function beeAnimationSuccess(dir) {
  let timeLine = gsap.timeline();
  if (dir === "left") {
    timeLine
      .to(".bee", { x: 0, y: 0, rotation: -70 }, 0)
      .to(".bee", {
        x: -420,
        y: 190,
        rotation: -70,
        duration: 1,
        onComplete: () => $(".bee img").attr("src", `./img/en/bee_happy.png`),
      })
      .to(".bee", { x: -420, y: 190, rotation: -210, duration: 1 })
      .to(".bee", {
        x: 450,
        y: 210,
        rotation: -210,
        duration: 2,
        onComplete: () => {
          let time = 1;
          let timer = setInterval(() => {
            time++;
            $(".honeycomb img").attr("src", `./img/en/honeycomb_0${time}.png`);
            if (time === 3) clearInterval(timer);
          }, 500);
        },
      });
  } else if (dir === "right") {
    timeLine
      .to(".bee", { x: 0, y: 0, rotation: -105 }, 0)
      .to(".bee", {
        x: -74,
        y: 230,
        rotation: -105,
        duration: 1,
        onComplete: () => $(".bee img").attr("src", `./img/en/bee_happy.png`),
      })
      .to(".bee", { x: -74, y: 230, rotation: -225, duration: 1 })
      .to(".bee", {
        x: 475,
        y: 220,
        rotation: -225,
        duration: 2,
        onComplete: () => {
          let time = 1;
          let timer = setInterval(() => {
            time++;
            $(".honeycomb img").attr("src", `./img/en/honeycomb_0${time}.png`);
            if (time === 3) clearInterval(timer);
          }, 500);
        },
      });
  }
}

function beeAnimationFail(dir) {
  let timeLine = gsap.timeline();
  if (dir === "left") {
    timeLine
      .to(".bee", { x: 0, y: 0, rotation: -70 }, 0)
      .to(".bee", {
        x: -420,
        y: 190,
        rotation: -70,
        duration: 1,
        onComplete: () => $(".bee img").attr("src", `./img/en/bee_sad.png`),
      })
      .to(".bee", { x: -420, y: 190, rotation: -255, duration: 1 })
      .to(".bee", { x: 0, y: 0, rotation: -255, duration: 1 });
  } else if (dir === "right") {
    timeLine
      .to(".bee", { x: 0, y: 0, rotation: -105 }, 0)
      .to(".bee", {
        x: -74,
        y: 230,
        rotation: -105,
        duration: 1,

        onComplete: () => $(".bee img").attr("src", `./img/en/bee_sad.png`),
      })
      .to(".bee", { x: -74, y: 230, rotation: -265, duration: 1 })
      .to(".bee", { x: 0, y: 0, rotation: -265, duration: 1 });
  }
}

function beforeClick() {
  if ($(".ans_list .answer").hasClass("not-active")) {
    $(".quiz_content .sound").addClass("active");
  }
}

let timer = [];
let answerRepeat = 0;

$(document).ready(function () {
  wrapContents();
  window.addEventListener("resize", resizer);
  window.addEventListener("DOMContentLoaded", resizer);

  $(".ans_list .answer").addClass("not-active");
  $(".ans_list .answer").on("click", beforeClick);

  quizAudioEvent();

  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("069449"));
});
