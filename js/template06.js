const hintEvent = (flg) => {
  $(".button_box .hint").on("click", () => {
    flg = !flg;
    if (flg) $(".hint_txt").addClass("active");
    else $(".hint_txt").removeClass("active");
  });
};

const answerEvent = (repeat) => {
  $(".button_box .submit").on("click touchstart", () => {
    const answer = $(".ans_box").attr("data-answer");
    const input_answer = document.querySelector(".ans_box .ans_type").value;
    if (!repeat) {
      repeat++;
      if (answer === input_answer) {
        playAudio(cor_audio);
        screenEdit(true);
      } else {
        playAudio(incor_audio);
        screenEdit(false, answer);
      }
    }
  });
};

const screenEdit = (flg, answer) => {
  if (flg) {
    // 인풋 박스 변경
    $(".ans_box .ans_type").addClass("succes");

    // 피자 위치 변경
    $(".pizza_right").addClass("correct");
  } else {
    // 인풋 박스 변경
    $(".ans_box .ans_type").addClass("fail");

    // 피자 위치 및 이미지 경로 변경
    $(".pizza_right").addClass("incorrect");
    $(".pizza_right img").attr("src", "./img/en/pizza_incorrect.png");

    // 오답 문구 문제 안에 추가
    let offsetTop = document.querySelector(".ans_box .ans_type").offsetTop + 125;
    let inserTag = `<p class="answer_text" style="top:${offsetTop}px">${answer}</p>`;
    $(".ans_box").append(inserTag);
  }

  // 배경 움직임 추가
  $(".bg-content").addClass("active");

  // 문제 클릭이벤트 삭제
  $(".ans_box .ans_type").css("pointer-events", "none");
  $(this).css("pointer-events", "none");
  $(".hint").css("pointer-events", "none");
};

$(document).ready(function () {
  // 공통
  wrapContents();
  window.addEventListener("resize", resizer);
  window.addEventListener("DOMContentLoaded", resizer);

  // 정답 맞추기 1번만
  let answerRepeat = 0;
  answerEvent(answerRepeat);

  // 힌트 보이기
  let hintFlg = false;
  hintEvent(hintFlg);

  // 텍스트 아웃라인
  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("005aad"));
  $(".button_box .hint_txt").css("textShadow", calculateStrokeTextCSS("bb7624"));
});
