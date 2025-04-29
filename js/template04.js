let audioCache = {};
let img1x1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/efMxjsAAAAASUVORK5CYII=";

$(document).ready(() => {
  wrapContents();
  window.addEventListener("resize", resizer);
  window.addEventListener("DOMContentLoaded", resizer);

  $(".quiz_content .quiz_text").css("textShadow", calculateStrokeTextCSS("0059ad"));

  let dragItems = document.querySelectorAll(".drag_area li");
  let dropItems = document.querySelectorAll(".drop_area li");
  let width = (window.innerWidth && document.body.clientWidth) || document.documentElement.clientWidth;
  let ratio = width / 1715;
  let factor = 1 / ratio - 1;

  let dragZone = [];
  setTimeout(() => {
    dragZone.push(Math.round($(".drop_area").offset().top));
    dragZone.push(Math.round($(".drop_area").offset().top + $(".drop_area").height() + 20));
  }, 1000);

  let dragFlg = false;
  let dragValue = "";
  let dragIdx = 0;

  dropItems.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (dragFlg) {
        dragFlg = false;
        playAudio(click_audio, audioCache);

        if (e.target.dataset.index) {
          $(".drag_area li")
            .eq(e.target.dataset.index - 1)
            .removeClass("active");
        }
        e.target.textContent = dragValue;
        e.target.dataset.index = dragIdx;
        e.target.classList.add("active");

        checkAnswer();
      }
    });
  });

  dragItems.forEach((item) => {
    let startX = 0;
    let startY = 0;

    item.addEventListener("drag", (e) => {
      e.preventDefault();
      e.stopPropagation();
      let deltaX = e.clientX - startX;
      let deltaY = e.clientY - startY;
      let coorX = deltaX + Math.round(deltaX * factor);
      let coorY = deltaY + Math.round(deltaY * factor);

      e.target.style.cursor = "grab";
      e.target.style.transform = `translate(${coorX}px, ${coorY}px)`;
      e.target.style.zIndex = "10";
    });

    item.addEventListener("dragend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.target.style.transform = `translate(0px, 0px)`;
      e.target.style.zIndex = "5";
      if (e.clientY > dragZone[0] && e.clientY < dragZone[1]) e.target.classList.add("active");
      else dragFlg = false;
    });

    item.addEventListener("dragstart", (event) => {
      playAudio(click_audio, audioCache);
      const img = new Image();
      img.src = img1x1;
      event.dataTransfer.setDragImage(img, 0, 0);

      startX = event.clientX;
      startY = event.clientY;
      dragValue = event.target.textContent;
      dragIdx = event.target.dataset.index;
      dragFlg = true;

      event.target.style.cursor = "grab";
      event.dataTransfer.effectAllowed = "move";
    });
  });

  document.querySelector(".question_box").addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });

  const checkAnswer = () => {
    let dropList = $(".ans_list li").length;
    let answerList = $(".ans_list .active").length;

    if (dropList === answerList) {
      let flgArr = [];

      $(".ans_list .active").each((idx, item) => {
        let answerFlg = $(item).data("answer") === item.textContent;
        flgArr.push(answerFlg);
        if (answerFlg) $(item).addClass("correct");
        else {
          $(item)
            .addClass("incorrect")
            .append(`<span lang="y">${$(item).data("answer")}</span>`);
        }
      });

      if (!flgArr.includes(false)) {
        playAudio(cor_audio, audioCache);
        $(".bg-content").addClass("active-correct");
      } else {
        playAudio(incor_audio, audioCache);
        $(".bg-content").addClass("active-incorrect");
      }
    } else return;
  };
});
