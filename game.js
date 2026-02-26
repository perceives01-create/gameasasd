const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");

const laneCount = 3;
const roadPadding = 40;
const laneWidth = (canvas.width - roadPadding * 2) / laneCount;

const colors = ["#78a9ff", "#7ef7c6", "#ffd166", "#f78c6b", "#c792ea", "#f0719b"];

const state = {
  playerLane: 1,
  playerLevel: 1,
  score: 0,
  speed: 3,
  spawnTick: 0,
  entities: [],
  gameOver: false,
};

function resetGame() {
  state.playerLane = 1;
  state.playerLevel = 1;
  state.score = 0;
  state.speed = 3;
  state.spawnTick = 0;
  state.entities = [];
  state.gameOver = false;
  messageEl.textContent = "";
  updateHud();
}

function updateHud() {
  scoreEl.textContent = state.score;
  levelEl.textContent = state.playerLevel;
}

function spawnEntity() {
  const lane = Math.floor(Math.random() * laneCount);
  const isBonus = Math.random() < 0.15;

  if (isBonus) {
    state.entities.push({ lane, y: -40, type: "coin", value: 50 });
    return;
  }

  const upperLevel = Math.max(2, state.playerLevel + 2);
  const level = 1 + Math.floor(Math.random() * upperLevel);
  state.entities.push({ lane, y: -40, type: "block", level });
}

function laneCenter(lane) {
  return roadPadding + laneWidth * lane + laneWidth / 2;
}

function playerRect() {
  return {
    x: laneCenter(state.playerLane) - 42,
    y: canvas.height - 100,
    w: 84,
    h: 84,
  };
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function update() {
  if (state.gameOver) return;

  state.spawnTick += 1;
  state.speed += 0.0008;

  if (state.spawnTick > 34) {
    state.spawnTick = 0;
    spawnEntity();
  }

  const p = playerRect();

  state.entities.forEach((entity) => {
    entity.y += state.speed;
  });

  state.entities = state.entities.filter((entity) => {
    if (entity.y > canvas.height + 60) return false;

    const rect = { x: laneCenter(entity.lane) - 34, y: entity.y, w: 68, h: 68 };

    if (intersects(p, rect)) {
      if (entity.type === "coin") {
        state.score += entity.value;
      } else if (entity.level === state.playerLevel) {
        state.playerLevel += 1;
        state.score += 100 * state.playerLevel;
        messageEl.textContent = `Merged! You are now level ${state.playerLevel}`;
      } else if (entity.level < state.playerLevel) {
        state.score += 25 * entity.level;
      } else {
        state.gameOver = true;
        messageEl.textContent = `Crash! Block level ${entity.level} was too strong.`;
      }
      updateHud();
      return false;
    }

    return true;
  });
}

function drawRoad() {
  ctx.fillStyle = "#111a31";
  ctx.fillRect(roadPadding, 0, canvas.width - roadPadding * 2, canvas.height);

  ctx.strokeStyle = "rgba(193, 208, 255, 0.35)";
  ctx.lineWidth = 4;
  ctx.strokeRect(roadPadding, 0, canvas.width - roadPadding * 2, canvas.height);

  ctx.setLineDash([18, 14]);
  ctx.strokeStyle = "rgba(226, 237, 255, 0.3)";
  ctx.lineWidth = 3;
  for (let i = 1; i < laneCount; i += 1) {
    const x = roadPadding + laneWidth * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawEntity(entity) {
  const x = laneCenter(entity.lane);
  const y = entity.y;

  if (entity.type === "coin") {
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(x, y + 34, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a5f00";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("$", x, y + 41);
    return;
  }

  const color = colors[(entity.level - 1) % colors.length];
  ctx.fillStyle = color;
  ctx.fillRect(x - 34, y, 68, 68);
  ctx.fillStyle = "#0f162d";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(entity.level), x, y + 44);
}

function drawPlayer() {
  const p = playerRect();
  const color = colors[(state.playerLevel - 1) % colors.length];

  ctx.fillStyle = color;
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = "#0d1430";
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(state.playerLevel), p.x + p.w / 2, p.y + 54);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  state.entities.forEach(drawEntity);
  drawPlayer();

  if (state.gameOver) {
    ctx.fillStyle = "rgba(5, 8, 18, 0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "600 20px sans-serif";
    ctx.fillText("Press Restart", canvas.width / 2, canvas.height / 2 + 24);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    state.playerLane = Math.max(0, state.playerLane - 1);
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    state.playerLane = Math.min(laneCount - 1, state.playerLane + 1);
  }
});

let touchStartX = 0;
canvas.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});
canvas.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 30) return;
  if (delta < 0) {
    state.playerLane = Math.max(0, state.playerLane - 1);
  } else {
    state.playerLane = Math.min(laneCount - 1, state.playerLane + 1);
  }
});

restartBtn.addEventListener("click", resetGame);

resetGame();
gameLoop();
