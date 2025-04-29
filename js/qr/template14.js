"use strict";

$(document).ready(() => {
  let _scale = scaleFunc();

  let dragZone = [];
  let dropArr = [];

  window.addEventListener("resize", () => {
    _scale = scaleFunc();
    dropArrFunction();
  });

  qs(".start").on("touchstart click", () => {
    pageFunc(".home_page", ".game_page");
    setTimeout(() => dropArrFunction(), 1000);
    qs(".move_ani").addClass("active");
    setTimeout(() => qs(".move_ani").remove(), 2000);
  });

  qs(".how_btn").on("touchstart click", () => howPopup("add"));
  qs(".how_popup").on("touchstart click", () => howPopup("remove"));

  let level = 0;
  let chance = 2;
  let dragValue = "";
  let dragFlg = false;
  let hint = null;

  let rectTop = 0;
  let rectLeft = 0;
  let wrapRect = null;

  const ansFunc = (e) => {
    Sound.click();
    let idx = qs(".quiz_ans li").index(e.currentTarget);
    if (chance > 1) qs(e.currentTarget).text("");
    else if (chance === 1) qs(e.currentTarget).html(insertHint(idx));
  };

  qs(".quiz_ans li").on("pointerup", (e) => ansFunc(e));

  qs(".quiz_top li").on("mousedown pointerdown", (e) => {
    if (e.type === "mousedown") dragStartFunc(e);
    else if (e.type === "pointerdown") dragStartFunc(e);
  });

  qs("#container")
    .on("pointermove touchmove", (e) => dragItem(e))
    .on("pointerup", (e) => touchDrop(e.clientX, e.clientY));

  qs(".next_btn").on("touchstart click", () => {
    qs(".ans_popup").removeClass("correct incorrect");
    level++;

    if (level + 1 === quizInfo.length) qs(".next_btn").addClass("end");

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
    qs(".quiz_order").text(`0${idx + 1}`);
    qs(".quiz_para").text(quizInfo[idx].quiz_para);
    let wordHTML = "";
    quizInfo[idx].word.split("").forEach((item) => {
      if (item !== " ") wordHTML += `<li></li>`;
      else wordHTML += `<li class="blank"></li>`;
    });
    qs(".quiz_ans").html(wordHTML);
    qs(".quiz_ans li").on("pointerup", (e) => ansFunc(e));
    qs(".pop_ans").text(quizInfo[idx].answer);
    qs(".pop_para").text(quizInfo[idx].answer_para);
  };

  // 드롭존 영역 계산
  const dropArrFunction = () => {
    dropArr = [];
    dragZone = [];
    dragZone.push(Math.round(qs(".quiz_ans").offset().top - 40));
    dragZone.push(Math.round(qs(".quiz_ans").offset().top + qs(".quiz_ans").height() + 20));
    qs(".quiz_ans li:not(.blank)").each((idx, item) => {
      let width = qs(item).width() * _scale;
      let coorX = [qs(item).offset().left, qs(item).offset().left + width];
      dropArr.push(coorX);
    });
  };

  // 정답 체크 처리
  const answerCheck = (idx) => {
    const answer = [...qs(".quiz_ans li")].map(getPureText).filter(Boolean);
    const correct = quizInfo[idx].answer.replace(/ /g, "").split("");
    const corArr = [];
    quizInfo[idx].answer.split("").forEach((item, idx) => {
      if (qs(".quiz_ans li").eq(idx).text() === item) corArr.push(true);
      else corArr.push(false);
    });

    if (answer.length === correct.length) {
      const isCorrect = correct.every((char, i) => char === answer[i]);
      hint = quizInfo[idx].word.split("");

      if (!isCorrect && chance > 1) {
        Sound.incorrect();
        chance--;
        qs(".quiz_ans li").each((idx, item) => {
          if (!$(item).hasClass("blank") && !corArr[idx]) qs(item).html(insertHint(idx));
        });
      } else if (!isCorrect && chance === 1) resetState("incorrect");
      else if (isCorrect) resetState("correct");
    }
  };

  // 값 초기화 및 팝업띄우기
  const resetState = (clsname) => {
    if (clsname === "correct") Sound.correct();
    else if (clsname === "incorrect") Sound.incorrect();
    qs(".ans_popup").addClass(clsname);
    chance = 2;
    dropArrFunction();
    hint = null;
  };

  // 드래그 시작 공통 코드
  const dragStartFunc = (e) => {
    Sound.drag();
    dragValue = e.target.textContent;
    dragFlg = true;
    qs(".quiz_top").append(`<li class="drag">${dragValue}</li>`);
    qs(".drag").css({
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "-1",
      pointerEvents: "none",
      touchAction: "none",
    });
    rectTop = qs(".drag").offset().top;
    rectLeft = qs(".drag").offset().left;
    wrapRect = qs(".drag")[0].getBoundingClientRect();
  };

  // 드래그 요소 공통 코드
  const dragItem = (event) => {
    event.preventDefault();
    if (dragFlg) {
      let clientX = event.type === "pointermove" ? event.clientX : event.changedTouches[0].clientX;
      let clientY = event.type === "pointermove" ? event.clientY : event.changedTouches[0].clientY;
      let coorX = (clientX - wrapRect.width / 2 - rectLeft) / _scale;
      let coorY = (clientY - wrapRect.height / 2 - rectTop) / _scale;

      qs(".drag").css({ zIndex: "10", transform: `translate(${coorX}px, ${coorY}px)` });
    }
  };

  // touchend 드롭 코드
  const touchDrop = (x, y) => {
    qs(".drag").remove();
    wrapRect = null;

    if (dragFlg && y > dragZone[0] && y < dragZone[1]) {
      let ansIdx = null;
      for (let i = 0; i < dropArr.length; i++) {
        if (x > dropArr[i][0] && x < dropArr[i][1]) {
          ansIdx = i;
          break;
        }
      }
      if (level === 0 && ansIdx > 2) ansIdx++;
      qs(".quiz_ans li").eq(ansIdx).text(dragValue);
      answerCheck(level);
    }
    dragFlg = false;
    dragValue = null;
  };

  const insertHint = (idx) => `<span class="word">${hint[idx]}</span>`;
});
