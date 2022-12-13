/**
 * Display cases on the bottom of the game
 */
// anchors
const homeAnchor = "#homeAnchor";
const perimeterAnchor = "#perimeterAnchor";
const compoundAnchor = "#compoundAnchor";
const santaOfficeAnchor = "#santaOfficeAnchor";

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
  $("#homeBtn").addClass("d-none");

  $(perimeterAnchor).addClass("d-none");
  $(santaOfficeAnchor).addClass("d-none");
  $(perimeterAnchor).removeClass("d-none");
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

/*******************************************
 * ***************** CASES *****************
 * *****************************************
 */
const selectCase = num => {
  const caseOne = $(`#case-${num}`);
  caseOne.removeClass("disabled");
  caseOne
    .find(".fa-solid")
    .removeClass("fa-lock")
    .addClass("fa-lock-open");
};

const start = () => {
  currentCase = 1;
  selectCase(currentCase);
  $(homeAnchor).addClass("d-none");

  $("#stats").removeClass("d-none");
  $(perimeterAnchor).removeClass("d-none");
};

/*******************************************
 * *****************************************
 * *************** PERIMETER ***************
 * *****************************************
 * *****************************************
 */
let allowPerimeter = false;
const gaurdCoords = [80, 185, 210, 352];
const gateCoords = [
  { x: [192, 221], y: [245, 275] },
  { x: [221, 285], y: [245, 378] },
  { x: [285, 450], y: [245, 275] },
];

const perimeterMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const guard = $("#guard");
  const gate = $("#gate");

  if (isWithin(base, gaurdCoords)) {
    guard.addClass("show");
  } else if (guard.hasClass("show")) {
    guard.removeClass("show");
  }

  if (isWithin(base, gateCoords)) {
    gate.addClass("show");
  } else if (gate.hasClass("show")) {
    gate.removeClass("show");
  }
};

const clickGuard = () => {
  $("#conversation").removeClass("d-none");

  const guardMessage = $("#guard-message");
  guardMessage.text("Hey there!");
  guardMessage.width(`${guardMessage.closest(".chat-message").width()}px`);

  const userMessage = $("#user-message");
  userMessage.text("I'm a messenger for the EA.");
  userMessage.width(`${userMessage.closest(".chat-message").width()}px`);

  if (!allowPerimeter) {
    updateProgress(10);
    document.getElementById("conversation").scrollIntoView();
  }
  allowPerimeter = true;
  $("#hint").removeClass("d-none");
};

const clickGate = () => {
  if (!allowPerimeter) return;
  updateProgress(10);

  $(perimeterAnchor).addClass("d-none");
  $(compoundAnchor).removeClass("d-none");
};

/*******************************************
 * *****************************************
 * *************** Compound ***************
 * *****************************************
 * *****************************************
 */
const workshopCoords = [105, 320, 40, 185];
const officeCoords = [440, 675, 30, 195];
const stableCoords = [150, 280, 210, 342];
const EAOfficeCoords = [420, 545, 225, 330];

const compoundMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const compoundImg = $("#compoundImg");

  if (isWithin(base, workshopCoords)) {
    compoundImg.addClass("cursor-pointer");
  } else if (isWithin(base, officeCoords)) {
    compoundImg.addClass("cursor-pointer");
  } else if (isWithin(base, stableCoords)) {
    compoundImg.addClass("cursor-pointer");
  } else if (isWithin(base, EAOfficeCoords)) {
    compoundImg.addClass("cursor-pointer");
  } else if (compoundImg.hasClass("cursor-pointer")) {
    compoundImg.removeClass("cursor-pointer");
  }
};

const compoundClick = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  if (isWithin(base, workshopCoords)) {
    alert("Workshop");
  } else if (isWithin(base, officeCoords)) {
    $("#homeBtn").removeClass("d-none");
    $(compoundAnchor).addClass("d-none");
    $(santaOfficeAnchor).removeClass("d-none");
  } else if (isWithin(base, stableCoords)) {
    alert("Deer Stable");
  } else if (isWithin(base, EAOfficeCoords)) {
    alert("Executive Management Office");
  }
};

/*******************************************
 * *****************************************
 * ************* Santa Office **************
 * *****************************************
 * *****************************************
 */
let santaModal;
const vaultCoords = [52, 265, 83, 365];

const santaOfficeMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const santaOffice = $("#santaOffice");
  if (isWithin(base, vaultCoords)) {
    santaOffice.addClass("cursor-pointer");
  } else if (santaOffice.hasClass("cursor-pointer")) {
    santaOffice.removeClass("cursor-pointer");
  }
};

const santaOfficeClick = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  if (isWithin(base, vaultCoords)) {
    // modal with textbox and unlock button
    santaModal.toggle();
  }
};

const unlockVault = () => {
  const password = document.getElementById("vaultPwd").value;
  console.log(password);
  if (password !== "S3cr3tV@ultPW") {
    $("#vaultPasswordError").removeClass("d-none");
    return;
  }

  // display flag
  $("#vaultPasswordError").addClass("d-none");
  santaModal.toggle();
};
