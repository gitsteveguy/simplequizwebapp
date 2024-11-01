// script.js

let questions = []; // Store questions from CSV
let currentQuestionIndex = 0;
let intervalTimer = 30; // Timer for each question (20 sec)
let totalTimer = 120; // Total time (1 min)

// Load questions from the CSV file
async function loadQuestions() {
  const response = await fetch("questions.csv");
  const data = await response.text();
  questions = data.split("\n").map((line) => line.trim());
  displayQuestion(); // Display the first question
}

// Display the current question
function displayQuestion() {
  const questionElement = document.getElementById("question");
  if (currentQuestionIndex < questions.length) {
    questionElement.textContent = questions[currentQuestionIndex];
  } else {
    questionElement.textContent = "No more questions!";
  }
}

// Handle next question logic
function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
    resetIntervalTimer();
  }
}

// Reset the 20-second interval timer
function resetIntervalTimer() {
  intervalTimer = 30;
}

// Countdown logic for both timers
function startTimers() {
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

    // Update total timer
    if (totalTimer > 0) {
      totalTimer--;
      totalTimerElement.textContent = totalTimer;
    } else {
      alert("Time is up!");
      clearInterval(time_interval); // Reload the page when time is up
    }
  }, 1000);
}

// Event listener for the next button
document.getElementById("next-btn").addEventListener("click", nextQuestion);

// Load questions and start timers on page load
window.onload = () => {
  loadQuestions();
  startTimers();
};
