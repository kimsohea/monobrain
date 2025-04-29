"use strict";

$(document).ready(() => {
  let touchPoint = navigator.maxTouchPoints;
  let appVer = navigator.userAgent;
  let appPlatform = "";
  if (appVer.includes("Linux")) appPlatform = "galaxy";
  else if (appVer.includes("Macintosh")) appPlatform = "mac";

  qs(".start").on("click", () => pageFunc(".home_page", ".game_page"));

  qs(".how_btn").on("click", () => howPopup("add"));
  qs(".how_popup").on("click", () => howPopup("remove"));

  let level = 0;
  let wordIdx = 0;
  let chance = 3;
  let corArr = [];
  let clickFlg = true;
  quizInfo.forEach(() => corArr.push(false));

  // 키보드 누를때 코드
  const keyboardFunc = (e) => {
    Sound.click();
    if (chance > 0 && !corArr[level]) {
      let quiz = qs(`.quiz_${level + 1} li`);
      quiz.eq(wordIdx).text(e.target.innerText).css("color", "#000");
      wordIdx++;
      if (wordIdx === quiz.length) {
        answerCheck(quiz);
        wordIdx = 0;
      }
    }
  };

  if (touchPoint > 0 && appPlatform === "mac") {
    qs(".keyboard li").on("touchstart", (e) => keyboardFunc(e));
  } else if (touchPoint > 0 && appPlatform === "galaxy") {
    qs(".keyboard li").on("click touchstart", (e) => keyboardFunc(e));
  } else qs(".keyboard li").on("click", (e) => keyboardFunc(e));

  // 정답 칸 빨간줄 효과
  const answerStr = (level) => {
    const ansArr = quizInfo[level].answer.split("");
    qs(".keyboard li").each(function () {
      const text = $(this).text().trim(); // li 안의 텍스트
      if (ansArr.includes(text)) {
        $(this).addClass("active");
        setTimeout(() => $(this).removeClass("active"), 1000);
      }
    });
  };

  // 정오답 체크
  const answerCheck = (item) => {
    clickFlg = false;
    const answer = [...item].map(getPureText).join("");
    const ansWord = quizInfo[level].answer;
    chance--;
    qs(".star").text(chance);

    if (answer !== ansWord && chance > 0) {
      Sound.incorrect();
      quizFunc("add", "incorrect");
      item.text("");
      answerFunc();
      answerCheckAfter("incorrect");
    } else if (answer !== ansWord && chance === 0) {
      Sound.incorrect();
      quizFunc("add", "incorrect done");
      let answer = ansWord.split("");
      qs(`.quiz_${level + 1} li`).each((idx, item) => $(item).text(answer[idx]));
      answerStr(level);
      answerCheckAfter("incorrect active", nextLvFunc);
    } else if (answer === ansWord) {
      Sound.correct();
      quizFunc("add", "correct done");
      answerStr(level);
      answerCheckAfter("correct active", nextLvFunc);
    }

    setTimeout(() => {
      clickFlg = true;
      if (!corArr.includes(false)) {
        qs(".complete_pop").addClass("active");
        Sound.complete();
      }
    }, 1100);
  };

  // 정오답 페이지 이동
  qs(".next_btn").on("click", () => {
    pageFunc(".game_page", ".end_page");
    qs(".how_btn").css("zIndex", -1);

    let ansStr = "";
    quizInfo.forEach(({ answer, quiz_para }) => {
      ansStr += `<li><strong>${answer}: </strong> ${quiz_para}</li>`;
    });
    qs(".ans_list").html(ansStr);
  });

  // 정답처리 후 글씨 추가 및 색상처리
  const answerFunc = () => {
    if (corArr[0]) {
      let item = qs(".quiz_item:nth-of-type(2) li:first-child");
      item.text("라").css("color", "#999");
      if (corArr[0] && corArr[1]) item.css("color", "#000");
    }
    if (corArr[1]) {
      let item = qs(".quiz_item:nth-of-type(1) li:nth-child(2)");
      item.text("라").css("color", "#999");
      if (corArr[0] && corArr[1]) item.css("color", "#000");
      let item2 = qs(".quiz_item:nth-of-type(3) li:first-child");
      item2.text("리").css("color", "#999");
      if (corArr[1] && corArr[2]) item2.css("color", "#000");
    }
    if (corArr[2]) {
      let item = qs(".quiz_item:nth-of-type(2) li:last-child");
      item.text("리").css("color", "#999");
      if (corArr[1] && corArr[2]) item.css("color", "#000");
      let item2 = qs(".quiz_item:nth-of-type(4) li:first-child");
      item2.text("트").css("color", "#999");
      if (corArr[2] && corArr[3]) item2.css("color", "#000");
    }
    if (corArr[3]) {
      let item = qs(".quiz_item:nth-of-type(3) li:last-child");
      item.text("트").css("color", "#999");
      if (corArr[2] && corArr[3]) item.css("color", "#000");
    }
    if (corArr[4]) {
      let item = qs(".quiz_item:nth-of-type(6) li:nth-child(2)");
      item.text("래").css("color", "#999");
      if (corArr[4] && corArr[5]) item.css("color", "#000");
    }
    if (corArr[5]) {
      let item = qs(".quiz_item:nth-of-type(5) li:nth-child(2)");
      item.text("래").css("color", "#999");
      if (corArr[4] && corArr[5]) item.css("color", "#000");
    }
  };

  // 퀴즈 칸 클릭 코드
  qs(".quiz_item").on("click", function () {
    if (clickFlg) {
      Sound.click();
      if (!corArr[level]) qs(`.quiz_item:nth-of-type(${level + 1}) li`).text("");
      if ($(this).hasClass(`quiz_1`)) level = 0;
      if ($(this).hasClass(`quiz_2`)) level = 1;
      if ($(this).hasClass(`quiz_3`)) level = 2;
      if ($(this).hasClass(`quiz_4`)) level = 3;
      if ($(this).hasClass(`quiz_5`)) level = 4;
      if ($(this).hasClass(`quiz_6`)) level = 5;
      answerFunc();
      wordIdx = 0;
      chance = 3;

      quizText(level);
      qs(".quiz_item").removeClass("active");
      $(this).addClass("active");
    }
  });

  // 퀴즈 문구 변경
  const quizText = (idx) => {
    qs(".quiz_box").addClass("active");
    qs(".order").text(quizInfo[idx].order);
    qs(".quiz_para").text(quizInfo[idx].quiz_para);
  };

  // 퀴즈 칸 모양 class 추가 및 제거
  const quizFunc = (method, state) => {
    if (method === "add") {
      qs(`.quiz_${level + 1}`).addClass(state);
      qs(".keyboard").removeClass("active");
    } else if (method === "remove") {
      qs(`.quiz_${level + 1}`).removeClass(state);
      qs(".keyboard").addClass("active");
    }
  };

  //  다음단계 로직
  const nextLvFunc = () => {
    corArr[level] = true;
    answerFunc();
    chance = 3;
    qs(".star").text(chance);
  };

  const answerCheckAfter = (state, call) => {
    setTimeout(() => {
      quizFunc("remove", state);
      if (typeof call === "function") call();
    }, 1000);
  };
});
