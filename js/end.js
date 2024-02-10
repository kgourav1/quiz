const username = document.querySelector("#username");
const saveScoreBtn = document.querySelector("#saveScoreBtn");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

const quizSummary = JSON.parse(localStorage.getItem("quizSummary")) || {};

// Extract data from quizSummary
const attempt = quizSummary.attempt || 0;
const correct = quizSummary.correct || 0;
const totalScore = quizSummary.totalScore || 0;

// Fill the table cells with data
document.getElementById("attempt").innerText = attempt;
document.getElementById("correct").innerText = correct;
document.getElementById("totalScore").innerText = totalScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value,
  };
  highScores.push(score);

  highScores.sort((a, b) => {
    return b.score - a.score;
  });

  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("./");
};
