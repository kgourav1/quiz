const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// Get the 'sub' value from the URL parameter
var subValue = getUrlParameter("sub");
// Function to parse URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Assuming os.json is in the same directory as this JavaScript file
const jsonFilePath = "./os/" + subValue + ".json";

// Fetch the JSON file
fetch(jsonFilePath)
  .then((response) => {
    // Check if response is OK
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Parse JSON
    return response.json();
  })
  .then((data) => {
    questions = data;
    startGame();
  })
  .catch((error) => {
    // Handle any errors
    console.error("There was a problem fetching the JSON file:", error);
  });

const SCORE_POINTS = 3;
const NEGATIVE_POINTS = 1;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  attempCounter = 0;
  score = 0;
  correctCounter = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    localStorage.setItem(
      "quizSummary",
      JSON.stringify({
        attempt: attempCounter,
        correct: correctCounter,
        totalScore: score,
      })
    );
    return window.location.assign(`./end.html?sub=${subValue}`);
  }

  questionCounter++;
  progressText.innerHTML = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionsIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionsIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    attempCounter++;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    let classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply == "correct") {
      incrementScore(SCORE_POINTS);
      correctCounter++;
    } else {
      decrementScore(NEGATIVE_POINTS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

decrementScore = (num) => {
  score -= num;
  scoreText.innerText = score;
};

const skipButton = document.querySelector(".skip-btn");

skipButton.addEventListener("click", () => {
  if (acceptingAnswers) {
    acceptingAnswers = false;
    getNewQuestion();
  }
});
