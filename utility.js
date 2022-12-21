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

const meta = {
  COMPOUND: {
    title: "Compound",
    description: "Click on a building to visit it.",
    id: 1,
  },
  PERIMETER_ONE: {
    title: "Perimeter: Essentially Free Entry",
    description: "Interact with items that highlight on hover.",
    id: 2,
  },
  PERIMETER: {
    title: "Perimeter",
    description: "Interact with items that highlight on hover.",
    id: 3,
  },
  SANTA_OFFICE: {
    title: "Santa Office",
    description: "Interact with items that highlight on hover.",
    id: 4,
  },
  DEER_STABLE: {
    title: "Deer Stable",
    description: "Nothing to see here at this time.",
    id: 5,
  },
  EA_OFFICE: {
    title: "Santa's Executive Assistant (EA) Office",
    description: "Interact with items that highlight on hover.",
    id: 6,
  },
  FLAG: {
    title: "Flag",
    description: "Interact with items that highlight on hover.",
    id: 7,
  },
  WORKSHOP: {
    title: "Workshop",
    description:
      "Security looks serious - Interact with items that highlight on hover.",
    id: 8,
  },
};

const homeButton = "#homeBtn";

let isBookOpen = false,
  isVaultOpen = false,
  isDoorOpen = false,
  isDrawerOpen = false,
  isLaptopOpen = false;
let activeScreen = 0;

const caseOneVaultPwd = "S3cr3tV@ultPW";
const caseTwoLaptopPwd = "MilkAndCookies";
const caseTwoVaultTxt = "3XtrR@_S3cr3tV@ultPW";
const caseThreeEALaptopPwd = "BanoffeePie";
// const caseThreeEALaptopPwd = "1";
const caseThreeSantaLaptopPwd = "H0tCh0coL@t3_02";
// const caseThreeSantaLaptopPwd = "2";
const caseThreeVaultTxt = "N3w4nd1m";
// const caseThreeVaultTxt = "3";
const caseThreeVaultText2 = "Pr0v3dV@ultPW";
const caseThreeOldPwd = "H0tCh0coL@t3_01";
const caseThreeVaultPwd = "N3w4nd1mPr0v3dV@ultPW";
// const caseThreeVaultPwd = "4";
const santaCode = "2845";

const initModal = id => new bootstrap.Modal(document.getElementById(id), {});
const flagModal = initModal("flag");
const gameOverModal = initModal("gameOver");
const infoModal = initModal("infoModal");
const pwdModal = initModal("pwdModal");
const warningModal = initModal("warningModal");

let targetTime, timerInterval, penaltyInterval, restartInterval;

let currentCase = -1;
let progress = 0;
let strikes = 0;
let eaLaptopPasswordAttempts = 0;
let eaPass = false;
let santaPass = false;
const disabledCopy = {};

const cases = [
  "Perimeter Focused",
  "Prevention Focused",
  "Disrupting Adversarial Objectives",
];

const restart = () => {
  if (restartInterval) clearInterval(restartInterval);

  // hide modals
  flagModal.hide();
  gameOverModal.hide();

  // hide interactions
  $("#vault,#txt-file-laptop-glow,#scanner,#door").removeClass("show");
  $("#interactive-laptop").removeClass("cursor-pointer");
  $("#envelope,#santa-card,#drawer,#postItNote,#book").removeClass("show");
  $("#eaOfficeLaptop,#ea-laptop-file,#ea-laptop-trash").removeClass("show");

  $("#conversation").addClass("d-none");
  setGuardMessage();
  setUserMessage();
  setGuardMessage(null, "guard-reply-message");

  nextCase(currentCase - 1);
  $("#pwd-text").val("");
  $("#passwordError").text("");

  if (currentCase === 3) {
    eaLaptopPasswordAttempts = 0;
    eaLaptopLogin = false;

    $("#workshop-open").addClass("d-none");
    $("#workshop-bg").removeClass("d-none");
    isDoorOpen = false;

    resetStrikes();
    toggleSantaPass(false);
    $("#passes").addClass("d-none");
    $("#strikes").addClass("d-none");
    acknowledge(false);
  }
};

const gameOver = (initialPoint = false) => {
  if (initialPoint) {
    $("#game-over-text").text(
      "Your purpose of visit does not merit an entry to Santa's Compound. I suggest you handle your business in another way. Have a lovely day ahead!"
    );
    document.getElementById("time").innerHTML = "00:00";
  } else {
    $("#game-over-text").text(
      "The guards have noticed that you’ve been gone a while and when they started to investigate, they saw you snooping around the compound. Game over!"
    );
    document.getElementById("time").innerHTML = "Game Over";
  }

  clearInterval(timerInterval);

  // hide modals
  flagModal.hide();
  infoModal.hide();
  pwdModal.hide();
  warningModal.hide();

  gameOverModal.toggle();
  restartInterval = setInterval(() => restart(), 8000);
};

const setTimer = minutes => {
  $("#clock").removeClass("d-none");

  const increment = minutes * 1000 * 60;
  targetTime = new Date(new Date().getTime() + increment).getTime();

  // Update the count down every 1 second
  timerInterval = setInterval(function() {
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
      gameOver();
    } else {
      document.getElementById("time").innerHTML = `${minutes}:${seconds}`;
    }
  }, 1000);
};

const setMeta = ({ title, description, id }) => {
  $("#title").text(title);
  $("#description").text(description);
  activeScreen = id;
};

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

const backToOffice = () => {
  isDrawerOpen = false;
  isLaptopOpen = false;

  // update headings
  $("#secondary-header").addClass("d-none");

  $("#ea-office-bg").removeClass("d-none");
  $("#open-drawer").addClass("d-none");
  $("#open-laptop").addClass("d-none");
};

const removePenalty = () => {
  if (penaltyInterval) {
    clearInterval(penaltyInterval);
    $("#clock").removeClass("text-danger");
  }
};

const goHome = () => {
  $(homeButton).addClass("d-none");

  $(perimeterAnchor).addClass("d-none");
  $(santaOfficeAnchor).addClass("d-none");
  $(workshopAnchor).addClass("d-none");
  $(deerAnchor).addClass("d-none");
  $(eaOfficeAnchor).addClass("d-none");
  $(flagAnchor).addClass("d-none");

  setMeta(meta.COMPOUND);
  $(compoundAnchor).removeClass("d-none");
  backToOffice();
  removePenalty();
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

  setMeta(meta.PERIMETER);
  $(perimeterAnchor).removeClass("d-none");

  if (timerInterval) {
    clearInterval(timerInterval);
    document.getElementById("time").innerHTML = "00:00";
  }
  $("#clock").addClass("d-none");
};

const checkEnter = (event, fn) => {
  if (event.code !== "Enter") return;

  if (fn) fn();
};

const copyText = (label = "flag-text", container = "flag-container") => {
  if (disabledCopy[label]) return;
  const text = $(`#${label}`).text();
  navigator.clipboard.writeText(text);

  const tooltip = bootstrap.Tooltip.getInstance(`#${container}`);
  tooltip.setContent({ ".tooltip-inner": "Copied!" });
  setTimeout(() => {
    tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
  }, 2000);
};

const toggleEAPass = (val = true) => {
  eaPass = val;
  if (val) {
    $("#ea-pass").removeClass("d-none");
  } else {
    $("#ea-pass").addClass("d-none");
  }
};

const toggleSantaPass = (val = true) => {
  santaPass = val;
  if (val) {
    $("#santa-pass").removeClass("d-none");
  } else {
    $("#santa-pass").addClass("d-none");
  }
};

const resetStrikes = () => {
  strikes = 0;
  $(".strike").removeClass("text-danger");
  $("#strike-info").html(strikes);
};

const addStrike = () => {
  strikes++;
  $(`#strike-${strikes}`).addClass("text-danger");
  $("#strike-info").html(strikes);
  if (strikes >= 3) {
    gameOver();
    return false;
  }

  targetTime = targetTime - 45000;
  showWarning(
    "Watch Out! Security has noticed this activity. Your timer is reduced each time it happens, you need to be more careful!",
    "Strike"
  );
  return true;
};

const increaseTimerSpeed = () => {
  $("#clock").addClass("text-danger");
  penaltyInterval = setInterval(function() {
    if (targetTime > 0) {
      targetTime -= 4000;
    }
  }, 1000);
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

const nextCase = (_case = null) => {
  currentCase = _case || currentCase;
  flagModal.hide();
  $("#flag-text").text("");

  isBookOpen = false;
  isVaultOpen = false;
  // update images
  $("#flag-bg").removeClass("d-none");
  $("#open-book").addClass("d-none");

  if (currentCase === 3) {
    goHome();
    return;
  }

  if ([1, 2].includes(currentCase)) {
    $("#txt-file-laptop").addClass("d-none");
    $("#interactive-laptop").removeClass("d-none");
    santaLaptopLogin = false;
  }

  completeCase(currentCase);
  currentCase++;
  selectCase(currentCase);
  resetGame();

  const text =
    currentCase === 2
      ? "In this level, Santa's security is ramped up. It has additional defense layers in place, but their main focus is prevention. We might be able to bypass them if we're patient and we play our cards right."
      : "In this level, Santa's security is at the maximum! Aside from the previous case's additional defense layers, Santa's defenses give feedback to the security team. Our room for mistake is very thin, and we should play our cards right the first time.";
  showInfo(text, "Instructions", null, true);
};

const start = () => {
  currentCase = 1;
  selectCase(currentCase);
  $(homeAnchor).addClass("d-none");

  $("#header").removeClass("d-none");
  setMeta(meta.PERIMETER_ONE);
  $(perimeterAnchor).removeClass("d-none");

  showInfo(
    "In this level, Santa's security is focused on the perimeter. Given that, we can expect that there may be complete trust within the compound.",
    "Instructions",
    null,
    true
  );
};

const showInfo = (
  text,
  heading,
  anchor,
  disableCopy = false,
  extraText = null
) => {
  $("#info-title").html(heading);
  $("#info-text").html(text);
  if (anchor) $(`#${anchor}`).removeClass("show");
  disabledCopy["info-text"] = disableCopy;

  const tooltip = bootstrap.Tooltip.getInstance(`#info-text-container`);
  if (disableCopy) {
    $("#info-modal-copy").addClass("d-none");
    $("#info-text-container").removeClass("cursor-pointer");
    tooltip.setContent({ ".tooltip-inner": heading });
  } else {
    $("#info-modal-copy").removeClass("d-none");
    $("#info-text-container").addClass("cursor-pointer");
    tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
  }

  if (extraText) {
    $("#info-extra-text").html(extraText);
  } else {
    $("#info-extra-text").html("");
  }
  infoModal.toggle();
};

const showWarning = (text, heading) => {
  $("#warning-title").html(heading);
  $("#warning-text").html(text);
  warningModal.toggle();
};

const closePwdModal = () => {
  isVaultOpen = false;
  $("#pwd-text").val("");
  $("#passwordError").text("");
  pwdModal.hide();
};

/*******************************************
 * *****************************************
 * *************** PERIMETER ***************
 * *****************************************
 * *****************************************
 */
let allowPerimeter = false,
  answered = false,
  caseThreeAcknowledge = false;

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
const phrases = [
  "I have to visit deer stable.",
  "I have a delivery for Santa's Executive Assistant.",
  "I have to meet my friends.",
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

const showHint = () => {
  let text = "";

  if (currentCase === 1) {
    text = "The guard did not seem to care about our excuse. ";
  }
  text += "Click on the <b>gate</b> to proceed.";
  $("#hint").removeClass("d-none");
  $("#hint-text").html(text);
  allowPerimeter = true;
};

const hideHint = () => {
  $("#hint").addClass("d-none");
  allowPerimeter = false;
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
  const content = `<p class="mb-1">Choose the best excuse for the guard to let you through the gate.</p><div class="row">${questions}</div>`;
  $("#guard-questions").html(content);
  $("#guard-questions").removeClass("d-none");
};

const setGuardMessage = (message = null, id = "guard-message") => {
  const guardMessage = $(`#${id}`);
  guardMessage.html(message || "");
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
  if (currentCase > 1 && index !== correctAnswer) {
    $(`#guard-answer-${index}`).addClass("text-bg-danger");
    gameOver(true);
    return;
  }

  $(`#guard-answer-${index}`).addClass("text-bg-success");
  $("#user-reply").removeClass("d-none");
  setUserMessage(phrases[index]);
  $("#guard-reply").removeClass("d-none");

  let guardReply =
    "Okay! Let me log your details quickly so you can go on your merry way.";
  if (currentCase === 3) {
    guardReply +=
      "<br/>You have been given an <b>EA Pass</b>. You can only go to Executive Assistance Office, right?";
  }
  setGuardMessage(guardReply, "guard-reply-message");

  answered = true;
  if (currentCase !== 3) {
    showHint();
  }

  if (currentCase === 3) {
    $("#case-3-acknowledgement").removeClass("d-none");
  }
};

const acknowledge = (val = true) => {
  caseThreeAcknowledge = val;
  if (val) {
    $("#case-3-acknowledgement-btn").addClass("text-bg-success");
    showHint();
  } else {
    $("#case-3-acknowledgement").addClass("d-none");
    $("#case-3-acknowledgement-btn").removeClass("text-bg-success");
    hideHint();
  }
};

const clickGuard = () => {
  if (allowPerimeter) return;

  $("#conversation").removeClass("d-none");

  setGuardMessage("Hey there! What is your purpose of the visit?");
  initGuardQuestions();
  $("#user-reply").addClass("d-none");
  $("#guard-reply").addClass("d-none");

  document.getElementById("conversation").scrollIntoView();
};

const clickGate = () => {
  if (!allowPerimeter) {
    showWarning(
      "The gate is closed. Talk to the guard to let you through.",
      "Warning"
    );
    $("#gate").removeClass("show");
    return;
  }

  $(perimeterAnchor).addClass("d-none");
  setMeta(meta.COMPOUND);
  $(compoundAnchor).removeClass("d-none");

  if (currentCase === 2) {
    setTimer(3);
  } else if (currentCase === 3) {
    setTimer(3);
    $("#passes").removeClass("d-none");
    toggleEAPass();
    $("#strikes").removeClass("d-none");
  }

  // reset state of the perimeter
  $("#conversation").addClass("d-none");
  setGuardMessage();
  setUserMessage();
  setGuardMessage(null, "guard-reply-message");

  answered = false;
  hideHint();
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
      showWarning("Workshop is closed at this moment.", "Workshop");
    } else if (currentCase === 2) {
      showWarning(
        "Workshop is closed at this moment. Someone noticed you snooping around but decided not to tell anyone about it.",
        "Workshop"
      );
    } else if (currentCase === 3) {
      if (!santaPass) {
        addStrike();
        return;
      }

      $(homeButton).removeClass("d-none");
      $(compoundAnchor).addClass("d-none");

      setMeta(meta.WORKSHOP);
      $(workshopAnchor).removeClass("d-none");
    }
  } else if (isWithin(base, officeCoords)) {
    if (currentCase === 3) {
      if (!santaPass) {
        addStrike();
        return;
      }
    }
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");

    setMeta(meta.SANTA_OFFICE);
    $(santaOfficeAnchor).removeClass("d-none");
  } else if (isWithin(base, stableCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");

    setMeta(meta.DEER_STABLE);
    if (currentCase === 3) {
      $("#description").text(
        "Nothing to see here except for deer... or is there really nothing?"
      );
      increaseTimerSpeed();
    }
    $(deerAnchor).removeClass("d-none");
  } else if (isWithin(base, EAOfficeCoords)) {
    $(homeButton).removeClass("d-none");
    $(compoundAnchor).addClass("d-none");

    setMeta(meta.EA_OFFICE);
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
const laptopCoords = [
  { x: [338, 637], y: [90, 275] },
  { x: [295, 680], y: [275, 363] },
];
let santaLaptopLogin = false;
let eaLaptopLogin = false;

const santaOfficeMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const vault = $("#vault");

  if (isWithin(base, vaultCoords)) {
    vault.addClass("show");
  } else if (vault.hasClass("show")) {
    vault.removeClass("show");
  }

  if (currentCase === 1) return;

  if (santaLaptopLogin) {
    const laptop = $("#txt-file-laptop-glow");
    if (isWithin(base, laptopCoords)) {
      laptop.addClass("show");
    } else if (laptop.hasClass("show")) {
      laptop.removeClass("show");
    }
    return;
  }

  const laptop = $("#interactive-laptop");
  if (isWithin(base, pwdHintCoords)) {
    laptop.addClass("cursor-pointer");
  } else if (isWithin(base, pwdInputCoords)) {
    laptop.addClass("cursor-pointer");
  } else if (laptop.hasClass("cursor-pointer")) {
    laptop.removeClass("cursor-pointer");
  }
};

const santaOfficeClick = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  if (currentCase === 1) return;

  if (santaLaptopLogin) {
    if (isWithin(base, laptopCoords)) {
      const title = currentCase === 2 ? "Vault.txt" : "Vault (1/2).txt";
      const pwd = currentCase === 2 ? caseTwoVaultTxt : caseThreeVaultTxt;
      showInfo(pwd, title, "txt-file-laptop-glow");
      return;
    }
  }

  const laptop = $("#interactive-laptop");
  if (isWithin(base, pwdHintCoords)) {
    const pwdHint =
      currentCase === 2
        ? "Santa's Favorite"
        : "MilkAndCookies are so yesterday";
    showInfo(pwdHint, "Password Hint");
  } else if (isWithin(base, pwdInputCoords)) {
    $("#pwd-modal-title").text("Laptop Password");
    pwdModal.toggle();
  }

  if (laptop.hasClass("cursor-pointer")) {
    laptop.removeClass("cursor-pointer");
  }
};

const clickVault = () => {
  // modal with textbox and unlock button
  $("#pwd-modal-title").text("Vault");
  pwdModal.toggle();
  isVaultOpen = true;
};

const unlockVault = () => {
  const password = document.getElementById("pwd-text").value;

  let match = caseOneVaultPwd;
  if (currentCase === 2) {
    match = isVaultOpen ? caseTwoVaultTxt : caseTwoLaptopPwd;
  }

  if (currentCase === 3) {
    if (activeScreen === meta.EA_OFFICE.id) {
      match = caseThreeEALaptopPwd;
    } else if (activeScreen === meta.WORKSHOP.id) {
      match = santaCode;
    } else if (isVaultOpen) {
      match = caseThreeVaultPwd;
    } else {
      match = caseThreeSantaLaptopPwd;
    }
  }

  if (password !== match) {
    if (currentCase === 3 && activeScreen === meta.EA_OFFICE.id) {
      eaLaptopPasswordAttempts++;
      const left =
        eaLaptopPasswordAttempts === 3 ? 3 : 3 - eaLaptopPasswordAttempts;
      $("#passwordError").text(
        `Invalid Password: ${left} more wrong attempt(s) will result in a strike.`
      );
      if (eaLaptopPasswordAttempts === 3) {
        eaLaptopPasswordAttempts = 0;
        addStrike();
      }
    } else if (currentCase === 3 && activeScreen === meta.WORKSHOP.id) {
      $("#passwordError").text("Invalid Code");
    } else {
      $("#passwordError").text("Invalid Password");
    }

    $("#passwordError").removeClass("d-none");
    return;
  } else {
    $("#pwd-text").val("");
  }

  // remove error warning and hide modal
  $("#passwordError").addClass("d-none");
  pwdModal.toggle();

  if (currentCase === 1) {
    // navigate to the flag screen
    $(santaOfficeAnchor).addClass("d-none");

    setMeta(meta.FLAG);
    $(flagAnchor).removeClass("d-none");
    return;
  }

  if (currentCase === 2) {
    if (isVaultOpen) {
      $("#txt-file-laptop").addClass("d-none");
      $("#interactive-laptop").removeClass("d-none");
      santaLaptopLogin = false;

      $(santaOfficeAnchor).addClass("d-none");

      setMeta(meta.FLAG);
      $(flagAnchor).removeClass("d-none");
      return;
    }

    $("#txt-file-laptop").removeClass("d-none");
    $("#interactive-laptop").addClass("d-none");
    santaLaptopLogin = true;
  }

  if (currentCase === 3) {
    if (activeScreen === meta.EA_OFFICE.id) {
      // update headings
      $("#secondary-heading").text("Executive Assistant Laptop");
      $("#secondary-header").removeClass("d-none");

      eaLaptopLogin = true;
      isLaptopOpen = true;

      const laptop = $("#eaOfficeLaptop");

      // update images
      $("#ea-office-bg").addClass("d-none");
      $("#open-laptop").removeClass("d-none");
      if (laptop.hasClass("show")) {
        laptop.removeClass("show");
      }
    }

    if (activeScreen === meta.SANTA_OFFICE.id) {
      if (isVaultOpen) {
        $("#txt-file-laptop").addClass("d-none");
        $("#interactive-laptop").removeClass("d-none");
        santaLaptopLogin = false;

        $(santaOfficeAnchor).addClass("d-none");

        setMeta(meta.FLAG);
        $(flagAnchor).removeClass("d-none");
        return;
      }

      santaLaptopLogin = true;
      $("#txt-file-laptop").removeClass("d-none");
      $("#interactive-laptop").addClass("d-none");
      return;
    }

    if (activeScreen === meta.WORKSHOP.id) {
      $("#workshop-open").removeClass("d-none");
      $("#workshop-bg").addClass("d-none");
      isDoorOpen = true;
    }
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
const santaPassCoords = [363, 461, 206, 257];
const postItNoteCoords = [478, 509, 120, 160];
const eaPwdHintCoords = [348, 406, 88, 94];
const eaPwdInputCoords = [348, 406, 99, 105];
const eaLaptopCoords = [
  { x: [323, 426], y: [64, 127] },
  { x: [304, 445], y: [127, 156] },
];
const eaFileCoords = [455, 505, 76, 132];
const eaTrashCoords = [460, 502, 208, 253];

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

    if (currentCase === 3) {
      const santaCard = $("#santa-card");
      if (isWithin(base, santaPassCoords)) {
        santaCard.addClass("show");
      } else if (santaCard.hasClass("show")) {
        santaCard.removeClass("show");
      }
    }
    return;
  }

  if (isLaptopOpen) {
    const file = $("#ea-laptop-file");
    if (isWithin(base, eaFileCoords)) {
      file.addClass("show");
    } else if (file.hasClass("show")) {
      file.removeClass("show");
    }

    const trash = $("#ea-laptop-trash");
    if (isWithin(base, eaTrashCoords)) {
      trash.addClass("show");
    } else if (trash.hasClass("show")) {
      trash.removeClass("show");
    }
    return;
  }

  if ([1, 3].includes(currentCase)) {
    const drawer = $("#drawer");
    if (isWithin(base, drawerCoords)) {
      drawer.addClass("show");
    } else if (drawer.hasClass("show")) {
      drawer.removeClass("show");
    }
  }

  if ([2, 3].includes(currentCase)) {
    const postItNote = $("#postItNote");
    if (isWithin(base, postItNoteCoords)) {
      postItNote.addClass("show");
    } else if (postItNote.hasClass("show")) {
      postItNote.removeClass("show");
    }
  }

  if (currentCase === 3) {
    const eaOfficeLaptop = $("#eaOfficeLaptop");
    if (isWithin(base, eaLaptopCoords)) {
      eaOfficeLaptop.addClass("show");
    } else if (eaOfficeLaptop.hasClass("show")) {
      eaOfficeLaptop.removeClass("show");
    }
  }
};

const openDrawer = () => {
  isDrawerOpen = true;
  const drawer = $("#drawer");

  // update headings
  $("#secondary-heading").text("Drawer");
  $("#secondary-header").removeClass("d-none");

  // update images
  $("#ea-office-bg").addClass("d-none");
  $("#open-drawer").removeClass("d-none");
  if (drawer.hasClass("show")) {
    drawer.removeClass("show");
  }
};

const seeNotes = () => {
  if (currentCase === 2) {
    showInfo("Prepare: MilkAndCookies", "Post-it Notes", "postItNote");
    return;
  }

  if (currentCase === 3) {
    const extraText = `<ul>
    <li>Buy my favorite BanoffeePie.</li>
    <li>Remind Santa to change his laptop password and make it harder to guess! Everyone knows his tendency to be lazy and repetitive...</li>
    </ul>`;
    showInfo("Reminders:", "Post-it Notes", "postItNote", true, extraText);
  }
};

const clickEAFile = () => {
  showInfo(caseThreeVaultText2, "Vault (2/2).txt", "ea-laptop-file");
};

const clickTrash = () => {
  showInfo(caseThreeOldPwd, "OldPW.txt", "ea-laptop-trash");
};

const clickEnvelope = () => {
  let heading = "Stack of Papers";
  if ([1, 2].includes(currentCase)) {
    heading = "Santa's Vault Password";
  }
  showInfo(caseOneVaultPwd, heading, "envelope");
};

const clickSantaCard = () => {
  if (currentCase !== 3) return;
  toggleSantaPass();
  showInfo(
    "Well done! You have collected the Santa Pass.",
    "Santa Pass",
    "santa-card",
    true
  );
};

const eaOfficeLaptopClick = () => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const laptop = $("#eaOfficeLaptop");
  if (isWithin(base, eaPwdHintCoords)) {
    showInfo("My Favorite!!!", "Password Hint");
  } else if (isWithin(base, eaPwdInputCoords)) {
    $("#pwd-modal-title").text("Laptop Password");
    pwdModal.toggle();
  }

  if (laptop.hasClass("show")) {
    laptop.removeClass("show");
  }
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

  let flag = atob("VEhNe0VaX2ZsQDYhfQ==");
  if (currentCase === 2) {
    flag = atob("VEhNe20wQHJfNXQzcFNfbjB3IX0=");
  } else if (currentCase === 3) {
    flag = atob("VEhNe0JAZF9ZM3QxXzFzX25AdTZodHl9");
    $("#code-container").removeClass("d-none");
    $("#santa-code").text(santaCode);
  }

  $("#flag-text").text(flag);
  const btnText = currentCase === 3 ? "Go to compound" : "Next Case";
  $("#next-case-btn").text(btnText);
  flagModal.toggle();
};

/*******************************************
 * *****************************************
 * ***************** Flag ******************
 * *****************************************
 * *****************************************
 */
const doorCoords = [412, 464, 227, 307];
const scannerCoords = [394, 409, 272, 290];

const workshopMouseover = event => {
  const { offsetX, offsetY } = event;
  const base = { offsetX, offsetY };

  const scanner = $("#scanner");
  if (isWithin(base, scannerCoords)) {
    scanner.addClass("show");
  } else if (scanner.hasClass("show")) {
    scanner.removeClass("show");
  }

  const door = $("#door");
  if (isWithin(base, doorCoords)) {
    door.addClass("show");
  } else if (door.hasClass("show")) {
    door.removeClass("show");
  }
};

const openDoor = () => {
  if (!isDoorOpen) {
    showWarning("The door is closed. Enter the PIN to unlock.", "Warning");
    return;
  }

  completeCase(currentCase);
  clearInterval(timerInterval);
  $("#home-title").text("Thank you for making it this far!");
  $("#home-description").addClass("d-none");
  $("#startBtn").addClass("d-none");
  $("#home-intro").addClass("d-none");
  $("#credits").removeClass("d-none");

  $("#final-flag").text(atob("VEhNe0QzZjNuNWVfMW5fRDNwdGhfMXNfazAwTCEhfQ=="));
  $("#final-flag-container").removeClass("d-none");

  $("#header").addClass("d-none");
  goHome();
  $(compoundAnchor).addClass("d-none");
  $(homeAnchor).removeClass("d-none");
};

const enterCode = () => {
  $("#pwd-modal-title").text("Santa Code");
  pwdModal.toggle();
};
