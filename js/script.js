let correctCount = 0;
let wrongCount = 0;
let actionStack = []; // To store our actions
let vibrationEnabled = false;
let soundEnabled = false;
let darkModeEnabled = true;
const isTouchDevice = "ontouchstart" in window; // Check if the device supports touch events
let correctButtonCooldown = false;
let wrongButtonCooldown = false;
const cooldownTime = 500; // In milliseconds.
const rowContainer = document.getElementById("rowContainer");
const filterButton = document.getElementById("filterButton");
let timestamp;

const correctButton = document.getElementById("correctButton");
const wrongButton = document.getElementById("wrongButton");
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const correctPercentageEl = document.getElementById("correctPercentage");
const wrongPercentageEl = document.getElementById("wrongPercentage");
const resetButton = document.getElementById("resetButton");
const correctResultElem = document.querySelector(".correct-container .result");
const wrongResultElem = document.querySelector(".wrong-container .result");

const goodGKeyCheckbox = document.getElementById("goodGKeyCheckbox");
const goodRightArrowKeyCheckbox = document.getElementById(
  "goodRightArrowKeyCheckbox"
);
const badGKeyCheckbox = document.getElementById("badGKeyCheckbox");
const badArrowKeyCheckbox = document.getElementById("badArrowKeyCheckbox");
const goodEnterKeyCheckbox = document.getElementById("goodEnterKeyCheckbox");
const goodPeriodKeyCheckbox = document.getElementById("goodPeriodKeyCheckbox");
const goodYKeyCheckbox = document.getElementById("goodYKeyCheckbox");
const badCommaKeyCheckbox = document.getElementById("badCommaKeyCheckbox");
const badNKeyCheckbox = document.getElementById("badNKeyCheckbox");
const badBackspaceKeyCheckbox = document.getElementById(
  "badBackspaceKeyCheckbox"
);
const revertButton = document.getElementById("revertButton");

const manualToggle = document.querySelector(".manual-toggle");
const manualContent = document.getElementById("manualContent");

const soundToggle = document.getElementById("soundToggle");
const positiveSound = document.getElementById("positiveSound");
const negativeSound = document.getElementById("negativeSound");

let prevCorrectCount = 0;
let prevWrongCount = 0;

document.addEventListener(
  "touchstart",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

function updateCounts() {
  let total = correctCount + wrongCount;

  correctCountEl.innerText = correctCount;
  wrongCountEl.innerText = wrongCount;

  if (total === 0) {
    correctPercentageEl.innerText = "0%";
    wrongPercentageEl.innerText = "0%";
  } else {
    correctPercentageEl.innerText =
      ((correctCount / total) * 100).toFixed(0) + "%";
    wrongPercentageEl.innerText = ((wrongCount / total) * 100).toFixed(0) + "%";
  }

  updateColor();
}

function updateColor() {
  const correctPercentage = parseInt(correctPercentageEl.innerText, 10);
  const wrongPercentage = parseInt(wrongPercentageEl.innerText, 10);

  // Reset classes
  correctResultElem.classList.remove("success", "exact-good");
  wrongResultElem.classList.remove("warning", "exact-bad");

  // Good color update
  if (correctPercentage > 80) {
    correctResultElem.classList.add("success");
  } else if (correctPercentage === 80) {
    correctResultElem.classList.add("exact-good");
  }

  // Bad color update
  if (wrongPercentage > 20) {
    wrongResultElem.classList.add("warning");
  } else if (wrongPercentage === 20) {
    wrongResultElem.classList.add("exact-bad");
  }
}

resetButton.addEventListener("click", function () {
  // Show the confirmation modal
  document.getElementById("confirmationModal").style.display = "flex";
});

document.getElementById("confirmDone").addEventListener("click", function () {
  // Reset the data when 'Confirm' button in the modal is clicked
  correctCount = 0;
  wrongCount = 0;
  actionStack = []; // reset the action stack
  updateCounts();
  removeAllRows();
  filterButtonReset();
  document.getElementById("confirmationModal").style.display = "none"; // Close the modal
});

document.getElementById("cancelDone").addEventListener("click", function () {
  // Simply close the modal without resetting the data
  document.getElementById("confirmationModal").style.display = "none";
});

revertButton.addEventListener("click", function () {
  const lastAction = actionStack.pop(); // get the last action
  if (lastAction === "correct") {
    correctCount--;
  } else if (lastAction === "wrong") {
    wrongCount--;
  }
  updateCounts();
  removeRow();
  const rows = Array.from(rowContainer.getElementsByClassName("table-results"));
  if (rows.length < 2) {
    filterButton.classList.add("filter-mode-off");
    return;
  }
});

document.addEventListener("keydown", function (event) {
  if (badArrowKeyCheckbox.checked && event.key === "ArrowLeft") {
    // Add your own logic for arrow keys if needed
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    wrongButton.click();
    addAndRemoveAnimationClass(wrongButton);
    return;
  }

  if (badCommaKeyCheckbox.checked && event.key === ",") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    wrongButton.click();
    addAndRemoveAnimationClass(wrongButton);
    return;
  }

  if (badBackspaceKeyCheckbox.checked && event.key === "Backspace") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    wrongButton.click();
    addAndRemoveAnimationClass(wrongButton);
    return;
  }

  if (badNKeyCheckbox.checked && event.key === "n") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    wrongButton.click();
    addAndRemoveAnimationClass(wrongButton);

    return;
  }

  if (goodRightArrowKeyCheckbox.checked && event.key === "ArrowRight") {
    // Add your own logic for arrow keys if needed
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    correctButton.click();
    addAndRemoveAnimationClass(correctButton);
    return;
  }

  if (goodEnterKeyCheckbox.checked && event.key === "Enter") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    correctButton.click();
    addAndRemoveAnimationClass(correctButton);
    return;
  }

  if (goodPeriodKeyCheckbox.checked && event.key === ".") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    correctButton.click();
    addAndRemoveAnimationClass(correctButton);
    return;
  }

  if (goodYKeyCheckbox.checked && event.key === "y") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;
    correctButton.click();
    addAndRemoveAnimationClass(correctButton);
    return;
  }
});

manualToggle.addEventListener("click", () => {
  if (manualContent.style.maxHeight) {
    manualContent.style.maxHeight = null;
  } else {
    manualContent.style.maxHeight = manualContent.scrollHeight + "px";
  }
});

document
  .querySelector(".settings-toggle")
  .addEventListener("click", function () {
    const settingsContent = document.getElementById("settingsContent");

    if (settingsContent.classList.contains("expanded")) {
      settingsContent.classList.remove("expanded");
      settingsContent.style.maxHeight = null; // Reset to CSS value when collapsing
    } else {
      settingsContent.style.maxHeight = settingsContent.scrollHeight + "px"; // Set to actual content height when expanding
      settingsContent.classList.add("expanded");
    }
  });

// Optional: Close the modal if clicked outside of it
window.onclick = function (event) {
  if (event.target == document.getElementById("confirmationModal")) {
    document.getElementById("confirmationModal").style.display = "none";
  }
};

// Dark mode.
document.addEventListener("DOMContentLoaded", (event) => {
  const darkModeToggle = document.getElementById("darkModeToggle");

  // Check for existing dark mode preference
  if (localStorage.getItem("isDarkMode") === "true") {
    document.body.classList.add("dark-mode");
    darkModeEnabled = true;
  }

  // Toggle dark mode on button click
  darkModeToggle.addEventListener("click", () => {
    darkModeEnabled = !darkModeEnabled;
    localStorage.setItem("isDarkMode", darkModeEnabled);

    if (darkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  });
});

// Listen for changes to the vibration toggle checkbox
document
  .getElementById("vibrationToggle")
  .addEventListener("change", function () {
    vibrationEnabled = this.checked;
  });

// Listen for changes to the sound toggle checkbox
document.getElementById("soundToggle").addEventListener("change", function () {
  soundEnabled = this.checked;
});

function initializeVibrationSetting() {
  const vibrationCheckbox = document.getElementById("vibrationToggle");
  vibrationEnabled = vibrationCheckbox.checked;
}

function initializeSoundSetting() {
  const soundCheckbox = document.getElementById("soundToggle");
  soundEnabled = soundCheckbox.checked;
}

function initializeDarkModeSetting() {
  const darkModeCheckbox = document.getElementById("darkModeToggle");
  darkModeEnabled = darkModeCheckbox.checked;
}

// Common logic for correct actions
function performCorrectAction() {
  if (!actionStack.length) {
    removeAllRows();
  }

  if (correctButtonCooldown) return;
  correctButtonCooldown = true;
  setTimeout(() => {
    correctButtonCooldown = false;
  }, cooldownTime);

  if (vibrationEnabled) {
    navigator.vibrate([50, 30, 50]);
  }

  if (soundEnabled) {
    positiveSound.load();
    positiveSound.muted = false;
    positiveSound.play();
  }
  actionStack.push("correct");
  setTimeStamp();
  correctCount++;
  updateCounts();
  addRow("good");
  filterButtonInit();
}

function setTimeStamp() {
  if (!timestamp) {
    timestamp = new Date().getTime();
  }
}

// Common logic for wrong actions
function performWrongAction() {
  if (!actionStack.length) {
    removeAllRows();
  }

  if (wrongButtonCooldown) return;
  wrongButtonCooldown = true;
  setTimeout(() => {
    wrongButtonCooldown = false;
  }, cooldownTime);

  if (vibrationEnabled) {
    navigator.vibrate([100, 50, 100]);
  }

  if (soundEnabled) {
    negativeSound.load();
    negativeSound.muted = false;
    negativeSound.play();
  }
  actionStack.push("wrong");
  setTimeStamp();
  wrongCount++;
  updateCounts();
  addRow("bad");
  filterButtonInit();
}

if (isTouchDevice) {
  // For touch devices
  correctButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    performCorrectAction();
  });

  wrongButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    performWrongAction();
  });
} else {
  correctButton.addEventListener("click", function () {
    performCorrectAction();
    removeDemoRows();
  });

  wrongButton.addEventListener("click", function () {
    performWrongAction();
    removeDemoRows();
  });
}

window.addEventListener("load", initializeVibrationSetting);
window.addEventListener("load", initializeSoundSetting);
window.addEventListener("load", initializeDarkModeSetting);

// Function to add and remove the animation class
function addAndRemoveAnimationClass(button) {
  button.classList.add("button-animation");
  setTimeout(() => {
    button.classList.remove("button-animation");
  }, 500); // Adjust the time to match your animation duration
}

negativeSound.addEventListener("ended", function () {
  negativeSound.pause();
  negativeSound.currentTime = 0;
});

positiveSound.addEventListener("ended", function () {
  positiveSound.pause();
  positiveSound.currentTime = 0;
});

// Table.
let filterMode = "all"; // all, good, bad

function removeDemoRows() {
  const demoRows = document.querySelectorAll(".demo-row");
  demoRows.forEach((row) => row.remove());
}

function addRow(type) {
  removeDemoRows(); // Remove demo rows

  const row = document.createElement("div");
  row.className = `table-results ${type}`;

  const typeCol = document.createElement("p");
  const typeSpan = document.createElement("span");
  // Bad: Good:
  const badIcon = "✗";
  const goodIcon = "✓";
  let iconType = "";
  if (type === "good") {
    iconType = goodIcon;
  } else {
    iconType = badIcon;
  }

  typeSpan.innerText =
    iconType + " " + type.charAt(0).toUpperCase() + type.slice(1);
  typeCol.classList.add("table-results-type");
  typeSpan.classList.add("table-results-type-name");
  typeCol.appendChild(typeSpan);

  // Time.
  const timeCol = document.createElement("p");
  const currentTime = new Date();
  const timestampNow = currentTime.getTime();
  const elapsedTime = timestampNow - timestamp; // 'timestamp' is when the event originally occurred, initialized with 'new Date().getTime();'
  const elapsedSeconds = Math.floor((elapsedTime / 1000) % 60);
  const elapsedMinutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const minutesSpan = document.createElement("span");
  minutesSpan.innerText = elapsedMinutes.toString() + "m";
  minutesSpan.classList.add("table-results-time-min");
  const secondsSpan = document.createElement("span");
  secondsSpan.innerText = elapsedSeconds.toString() + "s";
  secondsSpan.classList.add("table-results-time-sec");
  timeCol.appendChild(minutesSpan);
  timeCol.appendChild(document.createTextNode(" "));
  timeCol.appendChild(secondsSpan);
  timeCol.classList.add("table-results-time");

  row.appendChild(typeCol);
  row.appendChild(timeCol);
  rowContainer.insertBefore(row, rowContainer.firstChild); // Insert at the top

  applyFilter();
}

function removeRow() {
  const rowContainer = document.getElementById("rowContainer");
  const rowsWithClass = Array.from(
    rowContainer.getElementsByClassName("table-results")
  );

  if (rowsWithClass.length > 0) {
    const lastElement = rowsWithClass[0];
    lastElement.classList.add("remove-element-animation");
    setTimeout(() => {
      rowContainer.removeChild(lastElement);
    }, 400);
  }

  applyFilter();
}

function removeAllRows() {
  const demoRows = document.querySelectorAll(".demo-table-results");
  demoRows.forEach((row) => row.parentNode.removeChild(row));

  const rows = document.querySelectorAll(".table-results");
  rows.forEach((row) => row.parentNode.removeChild(row));
  applyFilter();
}

function applyFilter() {
  const rows = Array.from(rowContainer.getElementsByClassName("table-results"));
  rows.forEach((row) => {
    if (filterMode === "all") {
      row.style.display = "flex";
    } else {
      row.style.display = row.classList.contains(filterMode) ? "flex" : "none";
    }
  });

  // Set old row opacity.
  rows
    .slice(1)
    .forEach((row) => row.classList.remove("table-results-old-rows")); // Reset first.

  let currentRowType = Array.from(
    rowContainer.getElementsByClassName("table-results " + filterMode)
  );
  if (!currentRowType.length) {
    currentRowType = rows;
  }

  if (currentRowType.length > 1) {
    currentRowType
      .slice(1)
      .forEach((row) => row.classList.add("table-results-old-rows"));
  }
}

filterButton.addEventListener("click", () => {
  if (filterMode === "all") {
    filterMode = "good";
  } else if (filterMode === "good") {
    filterMode = "bad";
  } else {
    filterMode = "all";
  }
  filterButtonInit();
  applyFilter();
});

function filterButtonInit() {
  const rows = Array.from(rowContainer.getElementsByClassName("table-results"));
  if (rows.length === 0) {
    filterButton.classList.add("filter-mode-off");
    return;
  }

  filterButton.classList.remove("filter-mode-off");
  filterButton.classList.remove("filter-mode-all");
  filterButton.classList.remove("filter-mode-good");
  filterButton.classList.remove("filter-mode-bad");

  switch (filterMode) {
    case "all": {
      filterButton.classList.add("filter-mode-all");
      break;
    }
    case "good": {
      filterButton.classList.add("filter-mode-good");
      break;
    }
    case "bad": {
      filterButton.classList.add("filter-mode-bad");
      break;
    }
  }
}

function filterButtonReset() {
  filterButton.classList.remove("filter-mode-off");
  filterButton.classList.remove("filter-mode-all");
  filterButton.classList.remove("filter-mode-good");
  filterButton.classList.remove("filter-mode-bad");
  filterButton.classList.add("filter-mode-all");
  filterButton.classList.add("filter-mode-off");
}
