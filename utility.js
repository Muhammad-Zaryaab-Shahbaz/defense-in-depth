/**
 * Display cases on the bottom of the game
 */
const anchor = "#screen";
let currentCase = -1;
let progress = 0;
const cases = [
  "Perimeter Focused",
  "Prevention Focused",
  "Disrupting Adversarial Objectives",
];
const showCases = () => {
  let content = `<div class="row">`;
  cases.map((item, i) => {
    content += `<div class="col-4 py-1">
          <button id="case-${i + 1}"
           class="option case btn btn-lg text-white my-1 w-100 d-flex flex-column align-items-center justify-content-center fs-6 h-100 disabled">
              <i class="fa-solid fa-lock"></i>
              <small>Case ${i + 1}</small>
              <span>${item}</span>
          </button>
      </div>
      `;
  });
  content += "</div>";
  document.getElementById("cases-body").innerHTML = content;
};

const selectCase = num => {
  const caseOne = $(`#case-${num}`);
  caseOne.removeClass("disabled");
  caseOne
    .find(".fa-solid")
    .removeClass("fa-lock")
    .addClass("fa-lock-open");
};

/**
 * Set first case as active
 */
const start = () => {
  currentCase = 1;
  selectCase(currentCase);
  $("#home").addClass("d-none")
  $(anchor).load("./perimeter.html", () => {
    $("#stats").removeClass("d-none");
  });
};

const updateProgress = num => {
  // console.log(progress, num)
  progress += num;
  const total = 100;

  const percent =
    Math.round(((progress / total) * 100 + Number.EPSILON) * 100) / 100;
  const _progress = document.getElementById("puzzle-progress");
  const color = percent >= 50 ? "#A3EA2A" : "#ECBB0A";
  _progress.setAttribute("style", `color: ${color}`);
  $(_progress).html(`${percent}%`);
};

const goHome = () => {
  console.log("Home");
};

const isWithin = (event, coords) => {
  const { offsetX, offsetY } = event;
  if (typeof coords[0] === "number") {
    // [x1, x2, y1, y2]
    return (
      offsetX >= coords[0] &&
      offsetX <= coords[1] &&
      offsetY >= coords[2] &&
      offsetY <= coords[3]
    );
  }

  let within = false;
  for (let coord of coords) {
    const x = coord.x;
    const y = coord.y;
    if (
      offsetX >= x[0] &&
      offsetX <= x[1] &&
      offsetY >= y[0] &&
      offsetY <= y[1]
    ) {
      within = true;
      break;
    }
  }

  return within;
};
