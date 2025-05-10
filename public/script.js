window.startCount = function () {
  let score = 0;
  const scoreElement = document.getElementById("score");
  const myScoreElement = document.getElementById("my_score");
  const mount = document.getElementById("dawae-mount");

  if (!scoreElement || !mount || !myScoreElement) return;

  mount.addEventListener("click", () => {
    score++;
    scoreElement.textContent = score.toString();
    myScoreElement.textContent = score.toString();
  });
};
