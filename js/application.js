// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  var game = new GameManager(4, KeyboardInputManager, HTMLActuator,
                             LocalStorageManager);
  var targetSelect = document.querySelector(".winning-target-select");
  var targetLabel = document.querySelector(".winning-target-label");

  function updateTarget(target) {
    targetSelect.value = target;
    targetLabel.textContent = target;
  }

  updateTarget(game.winningTarget);

  targetSelect.addEventListener("change", function () {
    var target = Number(targetSelect.value);
    if (game.setWinningTarget(target)) updateTarget(target);
  });
});
