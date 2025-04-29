"use strict";

$(document).ready(() => {
  let touchPoint = navigator.maxTouchPoints;
  let appVer = navigator.userAgent;
  let appPlatform = "";
  if (appVer.includes("Linux")) appPlatform = "galaxy";
  else if (appVer.includes("Macintosh")) appPlatform = "mac";

  qs(".start").on("click", () => {
    pageFunc(".home_page", ".game_page");
    qs(".click_cursor").addClass("level0 active");
  });

  qs(".how_btn").on("touchstart click", () => howPopup("add"));
  qs(".how_popup").on("touchstart click", () => howPopup("remove"));

  qs(".click_box").on("click touchstart", () => {
    qs(".quiz_box").addClass("active");
    Sound.click();
  });

  qs(".close").on("click touchstart", () => {
    qs(".quiz_box").removeClass("active");
    Sound.click();
  });

  let level = 0;
  let jewelNum = 0;

  const quizFunc = (e) => {
    let answer = e.target.innerText === quizInfo[level].answer;
    qs(e.target).addClass("active");

    if (answer) {
      qs(".ans_box").addClass("correct");
      qs(".quiz_box").addClass("correct");
      jewelNum += quizInfo[level].level;
      qs(".jewel_length").text(`+${jewelNum}`);
      Sound.correct();
    } else {
      qs(".ans_box").addClass("incorrect");
      qs(".quiz_box").addClass("incorrect");
      Sound.incorrect();
    }

    setTimeout(() => {
      qs(".ans_box").removeClass("active correct incorrect");
      qs(".quiz_box").removeClass("active correct incorrect");
      quizText(level);
      qs(".click_box").removeClass("active");
      qs(".click_cursor").addClass("active");
    }, 1000);

    qs(".click_box").removeClass(`level${level}`);
    qs(".click_cursor").removeClass(`level${level}`);
    level++;
    if (level === 10) {
      setTimeout(() => {
        qs(".complete_box").addClass("active");
        qs(".jewel_value").text(`${jewelNum}`);
        Sound.complete();
      }, 1000);
    }
    qs(".click_box").addClass(`level${level} active`);
    qs(".click_cursor").addClass(`level${level}`).removeClass("active");
  };

  if (touchPoint > 0 && appPlatform === "mac") {
    qs(".ans_btn").on("touchstart", (e) => quizFunc(e));
  } else if (touchPoint > 0 && appPlatform === "galaxy") {
    qs(".ans_btn").on("click touchstart", (e) => quizFunc(e));
  } else qs(".ans_btn").on("click", (e) => quizFunc(e));

  const quizText = (idx) => {
    qs(".now_order").text(idx + 1);
    qs(".quiz_para").html(quizInfo[idx].quiz_para);

    qs(".jewel_num").text(quizInfo[idx].level);
    qs(".jewel_box").removeClass("level1 level2 level3").addClass(`level${quizInfo[idx].level}`);

    qs(".ans_btn").removeClass("active");

    qs(".ans_btn.left").text(quizInfo[idx].exampleL);
    qs(".ans_btn.right").text(quizInfo[idx].exampleR);
  };

  qs(".next_btn").on("click", () => {
    pageFunc(".game_page", ".end_page");
    qs(".how_btn").css("zIndex", -1);
  });
});
