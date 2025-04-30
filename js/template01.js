function answerEvent(repeat) {
  $(".ans_list .answer")
    .off("click")
    .on("click touchstart", function () {
      $(".fisherman").addClass("active");
      const answer = $(".ans_list").attr("data-answer");
      const btn_answer = $(this).attr("data-num");
      const cor_answer = $(".ans_list .answer").filter((idx, item) => $(item).attr("data-num") === answer);

      if (!repeat) {
        repeat++;
        if (answer === btn_answer) {
          Sound.correct();
          fishSuccess(btn_answer);
          cor_answer.addClass("success");
        } else {
          Sound.incorrect();
          fishFail(btn_answer);
          cor_answer.addClass("fail");
        }

        $(".ans_list").addClass("active");
      }
    });
}

function fishSuccess(dir) {
  let timeLine = gsap.timeline();
  $(".hook").addClass("active");
  $(".hook img").attr("src", "../img/en/hook_move.png");
  if (dir === "1") {
    timeLine
      .to(".ans_left>img", { x: 100, y: 80, rotation: 5 }, 0)
      .to(".ans_left>img", { x: 180, y: 180, rotation: -81, ease: "steps(1)" })
      .fromTo(
        ".hook",
        { scaleY: 1 },
        {
          scaleY: 0.6,
          duration: 1,
          onComplete: () => $(".fisherman img").attr("src", `./img/en/fishhook_cor.png`),
        }
      )
      .to(".ans_left>img", { x: 180, y: 10, rotation: -81, duration: 1 }, "-=1");
  } else if (dir === "2") {
    timeLine
      .to(".ans_right>img", { x: -80, y: 95, rotation: -15 }, 0)
      .to(".ans_right>img", {
        x: -80,
        y: 265,
        rotation: 35,
        ease: "steps(1)",
        onComplete: () => $(".fisherman img").attr("src", `./img/en/fishhook_cor.png`),
      })
      .fromTo(".hook", { scaleY: 1 }, { scaleY: 0.6, duration: 1 })
      .to(".ans_right>img", { x: -80, y: 75, rotation: 35, duration: 1 }, "-=1");
  }
}

function fishFail(dir) {
  let timeLine = gsap.timeline();
  $(".hook").addClass("active");
  $(".hook img").attr("src", "./img/en/hook_move.png");
  if (dir === "1") {
    timeLine
      .to(".ans_left>img", { x: 100, y: 80, rotation: 5 }, 0)
      .to(".ans_left>img", { x: 180, y: 180, rotation: -81, ease: "steps(1)" })
      .fromTo(
        ".hook",
        { scaleY: 1 },
        {
          scaleY: 0.6,
          duration: 1,
          onComplete: () => $(".fisherman img").attr("src", `./img/en/fishhook_incor.png`),
        }
      )
      .to(".ans_left>img", { x: 180, y: 50, rotation: -81, duration: 0.5 }, "-=1")
      .to(".ans_left>img", { x: 180, y: 20, rotation: -21, rotationY: 180, ease: "steps(1)" }, "-=0.6")
      .to(".ans_left>img", { x: 40, y: 0, rotation: -10, duration: 0.5 }, "-=0.5");
  } else if (dir === "2") {
    timeLine
      .to(".ans_right>img", { x: -70, y: 95, rotation: -15 }, 0)
      .to(".ans_right>img", { x: -80, y: 255, rotation: 35, ease: "steps(1)" })
      .fromTo(
        ".hook",
        { scaleY: 1 },
        {
          scaleY: 0.6,
          duration: 1,
          onComplete: () => $(".fisherman img").attr("src", `./img/en/fishhook_incor.png`),
        }
      )
      .to(".ans_right>img", { x: -80, y: 135, rotation: 35, duration: 0.5 }, "-=1")
      .to(".ans_right>img", { x: -80, y: 135, rotation: 15, rotationY: 180, ease: "steps(1)" }, "-=0.6")
      .to(".ans_right>img", { x: -30, y: 105, rotation: 0, duration: 0.5 }, "-=0.5");
  }
}

function quizAudioEvent() {
  $(".quiz_content .sound").on("click touchstart", function () {
    if ($(this).hasClass("notice_text")) $(this).removeClass("notice_text");
    Sound.runnyNose(timer, endFunc);
  });
}

function endFunc() {
  $(".ans_list .answer").removeClass("not-active");
  answerEvent(answerRepeat);
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

  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("005aad"));
});
