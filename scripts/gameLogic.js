import { AnalogueClock } from './scripts/clockEngine.js';

let currentClock;
let targetHour = 0;
let targetMinute = 0;

function generateQuestion() {
  targetHour = Math.floor(Math.random() * 12);
  targetMinute = Math.floor(Math.random() * 12) * 5;
  const questionText = document.getElementById('time-question');
  const formattedHour = targetHour === 0 ? 12 : targetHour;
  const formattedMinute = targetMinute.toString().padStart(2, '0');
  questionText.textContent = `Set the clock to ${formattedHour}:${formattedMinute}`;
}

function checkAnswer() {
  const userHour = currentClock.hour % 12;
  const userMinute = currentClock.minute;

  if (userHour === targetHour && userMinute === targetMinute) {
    alert('🎉 Correct!');
    generateQuestion();
  } else {
    alert('❌ Try again!');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  currentClock = new AnalogueClock('clockCanvas');
  generateQuestion();

  const checkBtn = document.getElementById('check-button');
  checkBtn.addEventListener('click', checkAnswer);
});
