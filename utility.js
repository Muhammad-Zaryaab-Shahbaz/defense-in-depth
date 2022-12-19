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
const flagAnchor = "#flagAnchor";

const homeButton = "#homeBtn";

let isBookOpen = false;

const caseOneVaultPwd = "S3cr3tV@ultPW";
const caseTwoLaptopPwd = "MilkAndCookies";

let workshopModal;
const initModal = id => new bootstrap.Modal(document.getElementById(id), {});
const flagModal = initModal("flag");
const gameOverModal = initModal("gameOver");
const infoModal = initModal("infoModal");
const pwdModal = initModal("pwdModal");

let targetTime;

let currentCase = -1;
let progress = 0;
const cases = [
  "Perimeter Focused",
  "Prevention Focused",
  "Disrupting Adversarial Objectives",
];

const setTimer = minutes => {
  $("#clock").removeClass("d-none");

  const increment = minutes * 1000 * 60;
  targetTime = new Date(new Date().getTime() + increment).getTime();

  // Update the count down every 1 second
  const timerInterval = setInterval(function() {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = targetTime - now;

    // Time calculations for days, hours, minutes and seconds
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    minutes = minutes.toString().padStart(2, "0");
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    seconds = seconds.toString().padStart(2, "0");

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      document.getElementById("time").innerHTML = "Game Over";
      gameOverModal.toggle();
      setTimeout(() => window.location.reload(), 10000);
    } else {
      document.getElementById("time").innerHTML = `${minutes}:${seconds}`;
    }
  }, 1000);
};

const setTitle = title => $("#title").text(title);

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

const closeDrawer = () => {
  isDrawerOpen = false;
  // update headings
  $("#drawer-heading").addClass("d-none");

  $("#ea-office-bg").removeClass("d-none");
  $("#open-drawer").addClass("d-none");
};

const goHome = () => {
  $(homeButton).addClass("d-none");

  $(perimeterAnchor).addClass("d-none");
  $(santaOfficeAnchor).addClass("d-none");
  $(workshopAnchor).addClass("d-none");
  $(deerAnchor).addClass("d-none");
  $(eaOfficeAnchor).addClass("d-none");
  $(flagAnchor).addClass("d-none");

  setTitle("Compound");
  $(compoundAnchor).removeClass("d-none");
  closeDrawer();
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

  setTitle("Perimeter");
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

  isBookOpen = false;
  // update images
  $("#flag-bg").removeClass("d-none");
  $("#open-book").addClass("d-none");

  if (currentCase === 1) {
    $("#interactive-laptop").removeClass("d-none");
  }

  completeCase(currentCase);
  currentCase++;
  selectCase(currentCase);
  resetGame();
};

const start = () => {
  currentCase = 1;
  selectCase(currentCase);
  $(homeAnchor).addClass("d-none");

  $("#header").removeClass("d-none");
  setTitle("Perimeter: Essentially Free Entry");
  $(perimeterAnchor).removeClass("d-none");
};

const showInfo = (text, heading, anchor) => {
  $("#info-title").html(heading);
  $("#info-text").html(text);
  infoModal.toggle();
  $(`#${anchor}`).removeClass("show");
};

/*******************************************
 * *****************************************
 * *************** PERIMETER ***************
 * *****************************************
 * *****************************************
 */
let allowPerimeter = false;
let answered = false;

const gaurdCoords = [80, 185, 210, 352];
const gateCoords = [
  { x: [192, 221], y: [245, 275] },
  { x: [221, 285], y: [245, 378] },
  { x: [285, 450], y: [245, 275] },
];
const guardQuestions = [
  "Visit deer stable",
  "Delivery for Santa's EA",
  "Meet my friends",
];
const correctAnswer = 1;

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

const initGuardQuestions = () => {
  const questions = guardQuestions
    .map(
      (question, index) => `
      <div class="col-md-4">
        <button class="guard-answer neutral btn w-100 text-white mb-1" id="guard-answer-${index}" 
          onclick="answerGuard(${index})">${question}</button>
      </div>`
    )
    .join("");
  const content = `<p class="mb-1">Choose an answer.</p><div class="row">${questions}</div>`;
  $("#guard-questions").html(content);
  $("#guard-questions").removeClass("d-none");
};

const setGuardMessage = (message = null, id = "guard-message") => {
  const guardMessage = $(`#${id}`);
  guardMessage.text(message || "");
  const width = message
    ? guardMessage.closest(".chat-message").width() - 70
    : 0;
  guardMessage.width(`${width}px`);
};

const setUserMessage = (message = null) => {
  const userMessage = $("#user-message");
  userMessage.text(message);
  const width = message ? userMessage.closest(".chat-message").width() - 70 : 0;
  userMessage.width(`${width}px`);
};

const answerGuard = index => {
  if (answered) return;

  $(".guard-answer").removeClass("text-bg-danger");
  if (index !== correctAnswer) {
    $(`#guard-answer-${index}`).addClass("text-bg-danger");
    return;
  }

  $(`#guard-answer-${index}`).addClass("text-bg-success");
  $("#user-reply").removeClass("d-none");
  setUserMessage("I have a delivery for Santa's EA");
  $("#guard-reply").removeClass("d-none");
  setGuardMessage(
    "Okay! let me log your details quickly so you can go on your merry way.",
    "guard-reply-message"
  );

  $("#hint").removeClass("d-none");
  answered = true;
  allowPerimeter = true;
};

const clickGuard = () => {
  if (allowPerimeter) return;

  $("#conversation").removeClass("d-none");
  if (currentCase === 1) {
    setGuardMessage("Hey there!");
    setUserMessage("I'm a messenger for the EA.");

    allowPerimeter = true;
    $("#hint").removeClass("d-none");
  } else if (currentCase === 2) {
    setGuardMessage("Hey there! What is your purpose of the visit?");
    initGuardQuestions();
    $("#user-reply").addClass("d-none");
  }

  document.getElementById("conversation").scrollIntoView();
};

const clickGate = () => {
  if (!allowPerimeter) return;

  $(perimeterAnchor).addClass("d-none");
  setTitle("Compound");
  $(compoundAnchor).removeClass("d-none");

  if (currentCase === 2) {
    setTimer(3);
  }

  // reset state of the perimeter
  $("#conversation").addClass("d-none");
  setGuardMessage();

  setUserMessage();
  allowPerimeter = false;
  answered = false;
  $("#hint").addClass("d-none");
  document.getElementById("title").scrollIntoView();
};

/*******************************************
 * *****************************************
 * *************** Compound ****************
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
    if (currentCase === 1) {
      $("#workshop-notice").html("Workshop is closed at this moment.");
    } else if (currentCase === 2) {
      $("#workshop-notice").html(
        "Workshop is closed at this moment. Someone noticed you snooping around but decided not to tell anyone about it."
      );
    }
    workshopModal.toggle();
  } else if (isWithin(base, officeCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");

    setTitle("Santa Office");
    $(santaOfficeAnchor).removeClass("d-none");
  } else if (isWithin(base, stableCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");

    setTitle("Deer stable");
    $(deerAnchor).removeClass("d-none");
  } else if (isWithin(base, EAOfficeCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");

    setTitle("Santa's EA Office");
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
const pwdHintCoords = [403, 578, 169, 188];
const pwdInputCoords = [403, 578, 205, 225];

const santaOfficeMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const vault = $("#vault");

  if (isWithin(base, vaultCoords)) {
    vault.addClass("show");
  } else if (vault.hasClass("show")) {
    vault.removeClass("show");
  }

  if (currentCase === 2) {
    const laptop = $("#interactive-laptop");
    if (isWithin(base, pwdHintCoords)) {
      laptop.addClass("cursor-pointer");
    } else if (isWithin(base, pwdInputCoords)) {
      laptop.addClass("cursor-pointer");
    } else if (laptop.hasClass("cursor-pointer")) {
      laptop.removeClass("cursor-pointer");
    }
  }
};

const santaOfficeClick = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  if (currentCase === 2) {
    const laptop = $("#interactive-laptop");
    if (isWithin(base, pwdHintCoords)) {
      showInfo("Santa's Favorite", "Password Hint");
    } else if (isWithin(base, pwdInputCoords)) {
      $("#pwd-modal-title").text("Laptop Password");
      pwdModal.toggle();
    }

    if (laptop.hasClass("cursor-pointer")) {
      laptop.removeClass("cursor-pointer");
    }
  }
};

const clickVault = () => {
  // modal with textbox and unlock button
  $("#pwd-modal-title").text("Vault");
  pwdModal.toggle();
};

const unlockVault = () => {
  const password = document.getElementById("pwd-text").value;

  const match = currentCase === 1 ? caseOneVaultPwd : caseTwoLaptopPwd;
  if (password !== match) {
    $("#passwordError").removeClass("d-none");
    return;
  }

  // remove error warning and hide modal
  $("#passwordError").addClass("d-none");
  pwdModal.toggle();

  if (currentCase === 1) {
    // navigate to the flag screen
    $(santaOfficeAnchor).addClass("d-none");

    setTitle("Flag");
    $(flagAnchor).removeClass("d-none");
    return;
  }

  if (currentCase === 2) {
    $("#vault-file-laptop").removeClass("d-none");
    $("#interactive-laptop").addClass("d-none");
  }
};

/*******************************************
 * *****************************************
 * *************** EA Office ***************
 * *****************************************
 * *****************************************
 */
const drawerCoords = [117, 266, 220, 273];
const envelopeCoords = [255, 410, 129, 190];
const postItNoteCoords = [478, 509, 120, 160];
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

  if (currentCase === 1) {
    const drawer = $("#drawer");
    if (isWithin(base, drawerCoords)) {
      drawer.addClass("show");
    } else if (drawer.hasClass("show")) {
      drawer.removeClass("show");
    }
  } else if (currentCase === 2) {
    const postItNote = $("#postItNote");
    if (isWithin(base, postItNoteCoords)) {
      postItNote.addClass("show");
    } else if (postItNote.hasClass("show")) {
      postItNote.removeClass("show");
    }
  }
};

const openDrawer = () => {
  isDrawerOpen = true;
  const drawer = $("#drawer");

  // update headings
  $("#drawer-heading").removeClass("d-none");

  // update images
  $("#ea-office-bg").addClass("d-none");
  $("#open-drawer").removeClass("d-none");
  if (drawer.hasClass("show")) {
    drawer.removeClass("show");
  }
};

const seeNotes = () => {
  showInfo("Prepare: MilkAndCookies", "Post-it Notes", "postItNote");
};

const clickEnvelope = () => {
  showInfo(caseOneVaultPwd, "Santa's Vault Password", "envelope");
};

/*******************************************
 * *****************************************
 * ***************** Flag ******************
 * *****************************************
 * *****************************************
 */
const bookCoords = [426, 594, 88, 336];

const flagMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  if (isBookOpen) {
    const book = $("#book");
    if (isWithin(base, bookCoords)) {
      book.addClass("show");
    } else if (book.hasClass("show")) {
      book.removeClass("show");
    }
    return;
  }

  const book = $("#book");
  if (isWithin(base, bookCoords)) {
    book.addClass("show");
  } else if (book.hasClass("show")) {
    book.removeClass("show");
  }
};

const openBook = () => {
  isBookOpen = true;
  const book = $("#book");

  // update images
  $("#flag-bg").addClass("d-none");
  $("#open-book").removeClass("d-none");
  if (book.hasClass("show")) {
    book.removeClass("show");
  }

  $("#flag-text").text(atob("VEhNe0VaX2ZsQDYhfQ=="));
  flagModal.toggle();
};
