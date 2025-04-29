// 모든 태그 main에 감싸기
const wrapContents = () => {
  if ($("body").find("main").length) return;

  let bodyChildren = $("body").children();
  let mainTag = $("<main></main>");

  mainTag.append(bodyChildren);
  $("body").append(mainTag);
};

// 화면 사이즈조정
const resizer = () => {
  var width = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
  const ratio = width / 1715;

  $("main").css({
    transform: `scale(${ratio})`,
    "transform-origin": "0 0",
  });
};

// 외곽선 들어간 글자 css처리
const calculateStrokeTextCSS = (color) => {
  let css = "";
  for (let i = 0; i < 16; i++) {
    let angle = (i * 2 * Math.PI) / 16;
    let cos = Math.round(10000 * Math.cos(angle)) / 10000;
    let sin = Math.round(10000 * Math.sin(angle)) / 10000;
    css += `calc(5px * ${cos}) calc(5px * ${sin}) 0 #${color}`;
    css += i < 15 ? ", " : "";
  }
  return css;
};
