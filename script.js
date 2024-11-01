let questions = [];
let currentQuestionIndex = 0;
const actualIntervalTimer = 30;
const actualTotalTimer = 120;
let intervalTimer = actualIntervalTimer;
let totalTimer = actualTotalTimer;
let isRunning = false; // Track if timer is running
let time_interval;

// Fetch the list of available CSV files and populate the dropdown
async function populateTeamDropdown() {
  const response = await fetch("./questions/list.json");
  const files = await response.json();

  const teamSelect = document.getElementById("team-select");
  files.forEach((file) => {
    const option = document.createElement("option");
    option.value = file;
    option.textContent = file.replace(".csv", "");
    teamSelect.appendChild(option);
  });
}

// Load questions from the selected CSV file and reset timers
async function loadQuestions(file) {
  const response = await fetch(`./questions/${file}`);
  const data = await response.text();
  questions = data.split("\n").map((line) => line.trim());
  currentQuestionIndex = 0;
  displayQuestion();
  resetTimers(); // Reset both timers when a new team is selected
  startTimers(); // Start timers after loading questions
}

// Display the current question
function displayQuestion() {
  const questionElement = document.getElementById("question");
  if (currentQuestionIndex < questions.length) {
    console.log(currentQuestionIndex, questions.length);
    questionElement.textContent = questions[currentQuestionIndex];
  } else {
    questionElement.textContent = "You have compleeted all the Questions !!!";
  }
}

// Handle next question logic
function nextQuestion() {
  if (currentQuestionIndex < questions.length) {
    currentQuestionIndex++;
    displayQuestion();
    resetIntervalTimer();
  }
}

// Reset the question interval timer
function resetIntervalTimer() {
  if (totalTimer >= actualIntervalTimer) intervalTimer = actualIntervalTimer;
  else intervalTimer = totalTimer !== 0 ? totalTimer - 1 : 0;
}

// Reset both interval and total timers
function resetTimers() {
  clearInterval(time_interval); // Clear any existing timer interval
  intervalTimer = actualIntervalTimer;
  totalTimer = actualTotalTimer;
  document.getElementById("interval-timer").textContent = intervalTimer;
  document.getElementById("total-timer").textContent = totalTimer;
  isRunning = false; // Ensure the timer is not marked as running yet
}

// Play/pause function for timers
function playPauseTimer() {
  const playPauseBtn = document.getElementById("play-pause-btn");
  if (isRunning) {
    clearInterval(time_interval);
    playPauseBtn.textContent = "Play";
    isRunning = false;
  } else {
    startTimers();
    playPauseBtn.textContent = "Pause";
    isRunning = true;
  }
}

// Countdown logic for both timers
function startTimers() {
  if (isRunning) return;
  isRunning = true;

  const intervalTimerElement = document.getElementById("interval-timer");
  const totalTimerElement = document.getElementById("total-timer");
  const intervalProgress = document.getElementById("interval-progress");
  const totalProgress = document.getElementById("total-progress");

  const intervalMax = actualIntervalTimer;
  const totalMax = actualTotalTimer;
  const intervalCircumference = 2 * Math.PI * 40;
  const totalCircumference = 2 * Math.PI * 40;

  const green = "#76c043"; // Start color (Green)
  const yellow = "#f7b500"; // Mid color (Yellow)
  const red = "#ff6347"; // End color (Red)

  time_interval = setInterval(() => {
    // Interval Timer Countdown
    if (intervalTimer > 0) {
      intervalTimer--;
    } else {
      nextQuestion();
    }
    intervalTimerElement.textContent = intervalTimer;
    intervalProgress.style.strokeDashoffset =
      intervalCircumference * (1 - intervalTimer / intervalMax);

    // Calculate smooth transition from Green -> Yellow -> Red
    const intervalFactor =
      intervalTimer > intervalMax * 0.5
        ? 2 * (1 - intervalTimer / intervalMax) // Green to Yellow transition
        : (2 * (intervalMax * 0.5 - intervalTimer)) / intervalMax; // Yellow to Red transition

    tcolor =
      intervalTimer > intervalMax * 0.5
        ? interpolateColor(green, yellow, intervalFactor)
        : interpolateColor(yellow, red, intervalFactor);
    intervalProgress.style.stroke = tcolor;
    document.getElementById("interval-timer").style.color = tcolor;

    // Total Timer Countdown
    if (totalTimer > 0) {
      totalTimer--;
      totalTimerElement.textContent = totalTimer;
      totalProgress.style.strokeDashoffset =
        totalCircumference * (1 - totalTimer / totalMax);

      // Calculate smooth transition from Green -> Yellow -> Red
      const totalFactor =
        totalTimer > totalMax * 0.5
          ? 2 * (1 - totalTimer / totalMax) // Green to Yellow transition
          : (2 * (totalMax * 0.5 - totalTimer)) / totalMax; // Yellow to Red transition

      tcolor =
        totalTimer > totalMax * 0.5
          ? interpolateColor(green, yellow, totalFactor)
          : interpolateColor(yellow, red, totalFactor);
      totalProgress.style.stroke = tcolor;
      document.getElementById("total-timer").style.color = tcolor;
    } else {
      const questionElement = document.getElementById("question");
      questionElement.textContent = "Time is Up!";
      clearInterval(time_interval);
    }
  }, 1000);
}

// Event listeners
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document
  .getElementById("play-pause-btn")
  .addEventListener("click", playPauseTimer);

// Load questions when a team is selected
document.getElementById("team-select").addEventListener("change", (event) => {
  if (event.target.value != "") {
    loadQuestions(event.target.value);
  } else {
    resetTimers(); // Reset timers if no team is selected
    document.getElementById("question").textContent = "Select a Team";
  }
});

function interpolateColor(startColor, endColor, factor) {
  const result = startColor
    .slice(1)
    .match(/.{2}/g)
    .map((hex, i) => {
      return Math.round(
        parseInt(hex, 16) * (1 - factor) +
          parseInt(endColor.slice(1).match(/.{2}/g)[i], 16) * factor
      );
    });
  return `#${result
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

// Populate dropdown on page load
window.onload = () => {
  populateTeamDropdown();
  resetTimers();
};
