let questions = [];
let currentQuestionIndex = 0;
let intervalTimer = 30;
let totalTimer = 120;
let isRunning = false; // Track if timer is running
let time_interval;

// Fetch the list of available CSV files and populate the dropdown
async function populateTeamDropdown() {
  const response = await fetch("/questions/list.json"); // Example endpoint
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
  const response = await fetch(`questions/${file}`);
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

// Reset the 30-second interval timer
function resetIntervalTimer() {
  intervalTimer = 30;
}

// Reset both interval and total timers
function resetTimers() {
  clearInterval(time_interval); // Clear any existing timer interval
  intervalTimer = 30;
  totalTimer = 120;
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
  } else {
    startTimers();
    playPauseBtn.textContent = "Pause";
  }
  isRunning = !isRunning;
}

// Countdown logic for both timers
function startTimers() {
  if (isRunning) return;
  isRunning = true;

  const intervalTimerElement = document.getElementById("interval-timer");
  const totalTimerElement = document.getElementById("total-timer");

  time_interval = setInterval(() => {
    // Update interval timer
    if (intervalTimer > 0) {
      intervalTimer--;
    } else {
      nextQuestion();
    }
    intervalTimerElement.textContent = intervalTimer;
    intervalTimerElement.style.borderColor =
      intervalTimer > 10 ? "#76c043" : "#ff6347"; // Green or red

    // Update total timer
    if (totalTimer > 0) {
      totalTimer--;
      totalTimerElement.textContent = totalTimer;
      totalTimerElement.style.borderColor =
        totalTimer > 30 ? "#76c043" : "#ff6347"; // Green or red
    } else {
      alert("Time is up!");
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
  if (event.target.value) {
    loadQuestions(event.target.value);
  } else {
    resetTimers(); // Reset timers if no team is selected
  }
});

// Populate dropdown on page load
window.onload = populateTeamDropdown;
