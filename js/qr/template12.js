"use strict";

$(document).ready(() => {
  qs(".start").on("click", () => pageFunc(".home_page", ".game_page"));

  qs(".how_btn").on("click", () => howPopup("add"));
  qs(".how_popup").on("click", () => howPopup("remove"));

  let level = 0;
  let chance = 0;
  let chanceIdx = 0;
  let chanceFlg = true;
  let success = 1;
  let hint = [];
  let answer = "";

  qs(".quiz_input").on("keydown", function (e) {
    if (e.key === "Enter") {
      let quizAnswer = quizInfo[level].answer.replace(/\s+/g, "");
      let ansTmp = this.value.replace(/\s+/g, "");
      let flg = quizAnswer === ansTmp;
      if (chanceFlg) {
        answer = quizInfo[level].answer;
        hint = answer.split("");
        chance = hint.length;
        chanceFlg = false;
      }
      if (flg && chance > 0 && success > 0) {
        qs(".quiz_input").removeClass("incorrect").addClass("correct");
        qs(".ans_box").addClass("correct");
        qs(".ans_popup").addClass("correct");
        Sound.correct();
        success--;
      } else if (!flg && chance > 1) {
        qs(".quiz_input").addClass("incorrect");
        qs(".ans_box").addClass("incorrect");
        setTimeout(() => qs(".ans_box").removeClass("incorrect"), 500);
        chance--;
        if (hint[chanceIdx] !== " ") qs(".quiz_mid li").eq(chanceIdx).text(hint[chanceIdx]);
        else {
          chanceIdx++;
          if (chanceIdx === quizAnswer.length) {
            qs(".quiz_input").addClass("incorrect");
            qs(".ans_popup").addClass("incorrect");
            return false;
          }
          qs(".quiz_mid li").eq(chanceIdx).text(hint[chanceIdx]);
          chance--;
        }
        chanceIdx++;
        Sound.incorrect();
      } else if (!flg && chance === 1) {
        qs(".quiz_input").addClass("incorrect");
        qs(".ans_popup").addClass("incorrect");
        Sound.incorrect();
        chance--;
      } else return;
    }
  });

  qs(".next_btn").on("click", (e) => {
    qs(".ans_box").removeClass("correct");
    qs(".ans_popup").removeClass("correct incorrect");
    qs(".quiz_input").removeClass("correct incorrect");
    chanceFlg = true;
    chanceIdx = 0;
    success = 1;
    level++;

    if (level + 1 === quizInfo.length) qs(".ans_popup").addClass("end");

    if (level < quizInfo.length) {
      quizText(level);
      Sound.click();
    } else {
      qs(".game_page").css("display", "none");
      qs(".end_page").css("display", "flex");
      qs(".how_btn").css("zIndex", -1);
      let ansStr = "";
      quizInfo.forEach(({ answer, answer_para }) => {
        ansStr += `<li><strong>${answer}: </strong> ${answer_para}</li>`;
      });
      qs(".ans_list").html(ansStr);
      Sound.complete();
    }
  });

  const quizText = (idx) => {
    qs(".quiz_order").text(quizInfo[idx].order);
    qs(".quiz_para").text(quizInfo[idx].quiz_para);
    qs(".quiz_input").val("");
    let wordHTML = "";
    quizInfo[idx].word.split("").forEach((item) => {
      if (item !== " ") wordHTML += `<li>${item}</li>`;
      else wordHTML += `<li class="blank"></li>`;
    });
    qs(".quiz_mid").html(wordHTML);

    qs(".pop_ans").text(quizInfo[idx].answer);
    qs(".pop_para").text(quizInfo[idx].answer_para);
  };
});
