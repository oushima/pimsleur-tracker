let correctCount = 0;
let wrongCount = 0;
let actionStack = []; // To store our actions

const correctButton = document.getElementById("correctButton");
const wrongButton = document.getElementById("wrongButton");
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const correctPercentageEl = document.getElementById("correctPercentage");
const wrongPercentageEl = document.getElementById("wrongPercentage");
const resetButton = document.getElementById("resetButton");
const correctResultElem = document.querySelector(".correct-container .result");
const wrongResultElem = document.querySelector(".wrong-container .result");

const goodKeyCheckbox = document.getElementById("goodKeyCheckbox");
const goodArrowKeyCheckbox = document.getElementById("goodArrowKeyCheckbox");
const badKeyCheckbox = document.getElementById("badKeyCheckbox");
const badArrowKeyCheckbox = document.getElementById("badArrowKeyCheckbox");
const revertButton = document.getElementById("revertButton");

const manualToggle = document.querySelector(".manual-toggle");
const manualContent = document.getElementById("manualContent");

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

correctButton.addEventListener("click", function () {
  actionStack.push("correct"); // store the action
  correctCount++;
  updateCounts();
});

wrongButton.addEventListener("click", function () {
  actionStack.push("wrong"); // store the action
  wrongCount++;
  updateCounts();
});

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
});

document.addEventListener("keydown", function (event) {
  if (goodKeyCheckbox.checked && event.key === "g") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;

    correctButton.click();
  }
  if (goodArrowKeyCheckbox.checked && event.key === "ArrowRight") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;

    correctButton.click();
  }
  if (badKeyCheckbox.checked && event.key === "b") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;

    wrongButton.click();
  }
  if (badArrowKeyCheckbox.checked && event.key === "ArrowLeft") {
    prevCorrectCount = correctCount;
    prevWrongCount = wrongCount;

    wrongButton.click();
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
