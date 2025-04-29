const answerEvent = (repeat) => {
  $(".button_box .submit").on("click touchstart", () => {
    const answer = document.querySelectorAll(".ans_type");
    const answerVal = [...answer].map((el) => el.dataset.answer);
    const input_answer = document.querySelectorAll(".ans_type");
    const inputVal = [...input_answer].map((el) => el.value);

    if (!repeat) {
      repeat++;
      const gradeArr = [];
      answerVal.forEach((item, idx) => {
        gradeArr.push(item === inputVal[idx]);
      });

      if (!gradeArr.includes(false)) {
        playAudio(cor_audio);
        screenEdit(true, answerVal);
      } else {
        playAudio(incor_audio);
        screenEdit(false, answerVal);
      }
    }
  });
};

const screenEdit = (flg, answerArr) => {
  // 오답 문구 문제 안에 추가
  let answer = document.querySelectorAll(".ans_box .ans_type");
  let type = $(".question_box").hasClass("line_4");
  answer.forEach((item, idx) => {
    if (item.value === answerArr[idx]) {
      item.classList.add("succes");
    } else {
      item.classList.add("fail");
      let topVal = type ? 65 : 55;
      let offsetTop = item.offsetTop + topVal;
      let offsetLeft = item.offsetLeft;

      let inserTag = `<li class="answer_text" style="top:${offsetTop}px; left:${offsetLeft}px"><p >${answerArr[idx]}</p></li>`;
      $(".ans_box").append(inserTag);

      // 신호등 이미지 경로 변경
      $(".blinker img").attr("src", "../img/en/blinker_red.png");
    }
  });

  if (flg) $(".bg-content").addClass("success");
  else $(".bg-content").addClass("fail");

  // 문제 클릭이벤트 삭제
  $(".button_box .submit").css("pointer-events", "none");
  $(this).css("pointer-events", "none");
  $(".ans_type").css("pointer-events", "none");
};

$(document).ready(function () {
  // 공통
  wrapContents();
  window.addEventListener("resize", resizer);
  window.addEventListener("DOMContentLoaded", resizer);

  // 정답 맞추기 1번만
  let answerRepeat = 0;
  answerEvent(answerRepeat);

  // 텍스트 아웃라인
  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("005aad"));
});
