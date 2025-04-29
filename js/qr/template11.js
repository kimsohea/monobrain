"use strict";

$(document).ready(() => {
  let level = 0;
  let txtIdx = 0;
  let timer = null;

  let doneFlg = false;
  let lierIdx = null;
  let answer = "";

  let popFlg = false;
  let restartFlg = false;
  let chance = 1;
  let charArr = [true, false, false, false, false];

  // 캐릭터 시간별 활성화
  const charInterval = () => {
    Sound.click();
    qs(".ans_icon img").attr("src", `./img/qr/emoji${txtIdx}.png`);
    qs(".quiz_char li").eq(txtIdx).find(".txt_box").text(quizInfo[level].textArr[txtIdx]);

    if (txtIdx > 0) charActive(txtIdx - 1, "remove");
    charActive(txtIdx, "add");
    charArr[txtIdx] = true;
    txtIdx++;
    if (txtIdx === 5) {
      clearInterval(timer);
      setTimeout(() => {
        charActive(txtIdx - 1, "remove");
        qs(".quiz_top").addClass("active");
      }, 1000);
      doneFlg = true;
    }
  };

  // 게임시작 클릭시 페이지넘김 및 캐릭터슬라이드
  qs(".start").on("click", () => {
    pageFunc(".home_page", ".game_page");
    textBoxFunction(txtIdx);
    txtIdx++;
    timer = setInterval(() => charInterval(), 1000);
  });

  // 첫번째 캐릭터 텍스트박스채우기
  const textBoxFunction = (idx) => {
    qs(".ans_icon img").attr("src", `./img/qr/emoji${idx}.png`);
    qs(".quiz_char li").eq(idx).addClass("active").find(".txt_box").text(quizInfo[level].textArr[idx]);
  };

  // 게임방법 클릭
  qs(".how_btn").on("click", () => howPopup("add"));
  qs(".how_popup").on("click", () => howPopup("remove"));

  // 캐릭터 활성화 이벤트 종료시 캐릭터 클릭이벤트
  qs(".quiz_char li").on("click", function () {
    let itemIdx = qs(".quiz_char li").index(this);
    Sound.click();
    if (doneFlg) {
      qs(".quiz_char li").removeClass("click");
      if (itemIdx === lierIdx) {
        lierIdx = null;
        qs(this).removeClass("click");
        qs(".ans_btn").removeClass("active");
      } else {
        lierIdx = itemIdx;
        qs(this).addClass("click");
      }
      if (lierIdx !== null && answer !== "") qs(".ans_btn").addClass("active");
    } else {
      clearInterval(timer);
      charArr[itemIdx] = true;
      qs(".quiz_char li").removeClass("active");
      qs(".quiz_char li").eq(itemIdx).addClass("active").find(".txt_box").text(quizInfo[level].textArr[itemIdx]);
      qs(".ans_icon img").attr("src", `./img/qr/emoji${itemIdx}.png`);
      if (!charArr.includes(false)) {
        doneFlg = true;
        qs(".quiz_top").addClass("active");
        qs(".quiz_char li").removeClass("active");
      }
    }
  });

  // 입력버튼 블러처리시 정답값 가져오기 입력값 활성화
  qs(".ans_input").on("keyup", function (e) {
    answer = e.target.value;
    if (lierIdx !== null && answer !== "") qs(".ans_btn").addClass("active");
  });

  // 입력버튼 클릭시 라이어 및 정답 리셋 및 팝업노출시 블러처리
  qs(".ans_btn")
    .on("click", (e) => {
      answerCheck();
      Sound.click();
      if (popFlg) qs(e.target).blur();
    })
    .on("focus", (e) => {
      if (popFlg) qs(e.target).blur();
    });

  // 재도전버튼이 아닐때만 다음으로
  qs(".next_btn").on("click", () => {
    qs(".ans_popup").removeClass("correct incorrect restart");
    qs(".quiz_char li").removeClass("click");
    qs(".ans_input").val("");
    qs(".ans_btn").removeClass("active");

    if (!restartFlg) {
      level++;

      if (level < quizInfo.length) {
        Sound.click();
        quizText(level);
        resetState();
        qs(".quiz_top").removeClass("active");
        textBoxFunction(txtIdx);
        txtIdx++;
        timer = setInterval(() => charInterval(), 1000);
      } else {
        qs(".game_page").css("display", "none");
        qs(".end_page").css("display", "flex");
        qs(".how_btn").css("zIndex", -1);
        Sound.complete();
      }
    }
  });

  // 퀴즈내 텍스트 바꾸기
  const quizText = (idx) => {
    qs(".pop_char").text(quizInfo[idx].lier);
    qs(".pop_ans").text(quizInfo[idx].answer);
    qs(".txt_box").text("");
    if (level === 4) qs(".pop_end").text("준비된 문제를 모두 풀었습니다");
  };

  // 정오답 처리
  const answerCheck = () => {
    // 라이어 선택 여부
    let lierFlg = quizInfo[level].lierIdx === lierIdx;

    // 답 맞는지 여부
    let quizAnswer = quizInfo[level].answer.replace(/[A-Z]/g, (match) => match.toLowerCase()).replace(/\s+/g, "");
    let ansTmp = answer.replace(/[A-Z]/g, (match) => match.toLowerCase()).replace(/\s+/g, "");
    let ansFlg = quizAnswer === ansTmp;
    if (level === 1 && ansTmp === "아이피주소") ansFlg = true;

    // 만약 마지막이면 단어확인 모양으로 변경
    if (level === 4) qs(".ans_popup").addClass("end");

    if (lierFlg && ansFlg) {
      restartFlg = false;
      popupFunc(true, "correct");
    } else if ((!lierFlg || !ansFlg) && chance === 0) {
      restartFlg = false;
      popupFunc(false, "incorrect");
    } else if ((!lierFlg || !ansFlg) && chance > 0) {
      restartFlg = true;
      popupFunc(false, "restart");
      chance--;
    }

    // 라이어 및 답변 리셋
    qs(".quiz_char li").eq(lierIdx).removeClass("click");
    lierIdx = null;
    answer = "";
  };

  // 캐릭터 활성화 함수
  const charActive = (idx, set) => {
    if (set === "add") qs(".quiz_char li").eq(idx).addClass("active");
    else if (set === "remove") qs(".quiz_char li").eq(idx).removeClass("active");
  };

  // 팝업 클래스 추가 함수
  const popupFunc = (flg, className) => {
    popFlg = true;
    qs(".ans_popup").addClass(className);
    if (flg) Sound.correct();
    else Sound.incorrect();
  };

  // 값 초기화 함수
  const resetState = () => {
    txtIdx = 0;
    doneFlg = false;
    lierIdx = null;
    answer = "";
    restartFlg = false;
    chance = 1;
    timer = null;
    popFlg = false;
    charArr = [true, false, false, false, false];
  };
});
