function showHighScores(filterSubject = null, sortBy = "attempt") {
  const highScoresList = document.getElementById("highScoresList");
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  // Filter scores based on subject if provided
  const filteredScores = filterSubject
    ? highScores.filter((score) => score.sub === filterSubject)
    : highScores;

  // Sort scores based on sortBy parameter
  filteredScores.sort((a, b) => b[sortBy] - a[sortBy]);

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Name", "Subject", "Attempt", "Correct", "Total Score"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  filteredScores.forEach((score) => {
    const dataRow = document.createElement("tr");
    const dataKeys = ["name", "sub", "attempt", "correct", "totalScore"];
    dataKeys.forEach((key) => {
      const td = document.createElement("td");
      td.textContent = score[key];
      dataRow.appendChild(td);
    });
    tbody.appendChild(dataRow);
  });
  table.appendChild(tbody);

  highScoresList.innerHTML = "";
  highScoresList.appendChild(table);
}

showHighScores();

const clearLeaderboardBtn = document.getElementById("clearLeaderboard");
clearLeaderboardBtn.addEventListener("click", () => {
  localStorage.removeItem("highScores");
  // Clear the leaderboard table
  highScoresList.innerHTML = "";
});
