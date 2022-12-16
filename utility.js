/**
 * Display cases on the bottom of the game
 */
// anchors
const homeAnchor = "#homeAnchor";
const perimeterAnchor = "#perimeterAnchor";
const compoundAnchor = "#compoundAnchor";
const santaOfficeAnchor = "#santaOfficeAnchor";
const workshopAnchor = "#workshopAnchor";
const deerAnchor = "#deerAnchor";
const eaOfficeAnchor = "#eaOfficeAnchor";

const homeButton = "#homeBtn";

const caseOneVaultPwd = "S3cr3tV@ultPW";

let santaModal, workshopModal, vaultPwdModal;
const initModal = id => new bootstrap.Modal(document.getElementById(id), {});
let flagModal = initModal("flag");

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
    content += `<div class="case-container col-4 py-1 position-relative">
    <span class="case-badge badge text-bg-success position-absolute d-none"
      id="case-badge-${i + 1}">Active</span>
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
  // -1 means reset the progress
  progress = num === -1 ? 0 : progress + num;
  const total = 100;

  const percent =
    Math.round(((progress / total) * 100 + Number.EPSILON) * 100) / 100;
  const _progress = document.getElementById("puzzle-progress");
  const color = percent >= 50 ? "#A3EA2A" : "#ECBB0A";
  _progress.setAttribute("style", `color: ${color}`);
  $(_progress).html(`${percent}%`);
};

const goHome = () => {
  $(homeButton).addClass("d-none");

  $(perimeterAnchor).addClass("d-none");
  $(santaOfficeAnchor).addClass("d-none");
  $(workshopAnchor).addClass("d-none");
  $(deerAnchor).addClass("d-none");
  $(eaOfficeAnchor).addClass("d-none");
  $(compoundAnchor).removeClass("d-none");
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

const resetGame = () => {
  goHome();
  $(compoundAnchor).addClass("d-none");

  updateProgress(-1);

  $(perimeterAnchor).removeClass("d-none");
};

const checkEnter = (event, fn) => {
  if (event.code !== "Enter") return;

  if (fn) fn();
};

const copyText = (label = "flag-text", container = "flag-container") => {
  const text = $(`#${label}`).text();
  navigator.clipboard.writeText(text);

  const tooltip = bootstrap.Tooltip.getInstance(`#${container}`);
  tooltip.setContent({ ".tooltip-inner": "Copied!" });
  setTimeout(() => {
    tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
  }, 2000);
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
  $(`#case-badge-${num}`).removeClass("d-none");
};

const deselectCase = num => {
  const caseOne = $(`#case-${num}`);
  caseOne.addClass("disabled");
  caseOne
    .find(".fa-solid")
    .removeClass("fa-lock-open")
    .addClass("fa-lock");
};

const completeCase = num => {
  const caseOne = $(`#case-${num}`);
  caseOne.removeClass("disabled option");
  caseOne.addClass("thm-bg-success");
  $(`#case-badge-${num}`).text("Completed");
};

const nextCase = () => {
  flagModal.toggle();
  $("#flag-text").text("");

  completeCase(currentCase);
  currentCase++;
  selectCase(currentCase);
  resetGame();
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

  // reset state of the perimeter
  $("#conversation").addClass("d-none");
  const guardMessage = $("#guard-message");
  guardMessage.text("");
  guardMessage.width(`0px`);

  const userMessage = $("#user-message");
  userMessage.text("");
  userMessage.width(`0px`);
  allowPerimeter = false;
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
    workshopModal.toggle();
  } else if (isWithin(base, officeCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");
    $(santaOfficeAnchor).removeClass("d-none");
  } else if (isWithin(base, stableCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");
    $(deerAnchor).removeClass("d-none");
  } else if (isWithin(base, EAOfficeCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");
    $(eaOfficeAnchor).removeClass("d-none");
  }
};

/*******************************************
 * *****************************************
 * ************* Santa Office **************
 * *****************************************
 * *****************************************
 */
const vaultCoords = [52, 265, 83, 365];

const santaOfficeMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const vault = $("#vault");

  if (isWithin(base, vaultCoords)) {
    vault.addClass("show");
  } else if (vault.hasClass("show")) {
    vault.removeClass("show");
  }
};

const clickVault = () => {
  // modal with textbox and unlock button
  santaModal.toggle();
};

const unlockVault = () => {
  const password = document.getElementById("vaultPwd").value;
  if (password !== caseOneVaultPwd) {
    $("#vaultPasswordError").removeClass("d-none");
    return;
  }

  // display flag
  $("#vaultPasswordError").addClass("d-none");
  santaModal.toggle();

  $("#flag-text").text(atob("VEhNe0VaX2ZsQDYhfQ=="));
  flagModal.toggle();
};

/*******************************************
 * *****************************************
 * *************** EA Office ***************
 * *****************************************
 * *****************************************
 */
let drawerCoords = [117, 266, 220, 273];
let envelopeCoords = [255, 410, 129, 190];
let isDrawerOpen = false;

const eaOfficeMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  if (isDrawerOpen) {
    const envelope = $("#envelope");
    if (isWithin(base, envelopeCoords)) {
      envelope.addClass("show");
    } else if (envelope.hasClass("show")) {
      envelope.removeClass("show");
    }
    return;
  }

  const drawer = $("#drawer");
  if (isWithin(base, drawerCoords)) {
    drawer.addClass("show");
  } else if (drawer.hasClass("show")) {
    drawer.removeClass("show");
  }
};

const openDrawer = () => {
  isDrawerOpen = true;
  const drawer = $("#drawer");

  // update headings
  $("#ea-office-heading").addClass("d-none");
  $("#drawer-heading").removeClass("d-none");

  // update images
  $("#ea-office-bg").addClass("d-none");
  $("#open-drawer").removeClass("d-none");
  if (drawer.hasClass("show")) {
    drawer.removeClass("show");
  }
};

const closeDrawer = () => {
  isDrawerOpen = false;
  // update headings
  $("#drawer-heading").addClass("d-none");
  $("#ea-office-heading").removeClass("d-none");

  $("#ea-office-bg").removeClass("d-none");
  $("#open-drawer").addClass("d-none");
};

const clickEnvelope = () => {
  $("#vault-pwd").html(caseOneVaultPwd);
  vaultPwdModal.toggle();
};
