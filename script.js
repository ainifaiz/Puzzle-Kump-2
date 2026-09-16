const WORDS = [
  "KERJASAMA", "DAPAT", "MENGUKUHKAN", "SEMANGAT",
  "PERPADUAN", "SERTA", "MEWUJUDKAN", "PERSEKITARAN",
  "YANG", "SIHAT", "DAN", "SELAMAT"
];

const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const checkBtn = document.getElementById("checkBtn");
const flipBtn = document.getElementById("flipBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");
const messagePanel = document.getElementById("messagePanel");
const messageEl = document.getElementById("message");
const finalMessage = document.getElementById("finalMessage");

let order = [...Array(12).keys()];
let selected = null;
let solved = false;
let flipped = false;
let draggedIndex = null;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeShuffledOrder() {
  let a = shuffleArray([...Array(12).keys()]);
  while (a.every((v, i) => v === i)) a = shuffleArray(a);
  return a;
}

function render() {
  board.innerHTML = "";

  order.forEach((pieceId, position) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.position = position;
    card.dataset.piece = pieceId;
    card.draggable = !solved;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face front">
          <img src="assets/piece-${String(pieceId + 1).padStart(2, "0")}.png"
               alt="Keping puzzle ${pieceId + 1}">
        </div>
        <div class="card-face back">
          <div class="word">${WORDS[pieceId]}</div>
        </div>
      </div>
    `;

    if (selected === position) card.classList.add("selected");
    if (flipped) card.classList.add("flipped");

    card.addEventListener("click", () => handleCardClick(position));
    card.addEventListener("dragstart", () => {
      if (solved) return;
      draggedIndex = position;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      draggedIndex = null;
      card.classList.remove("dragging");
    });
    card.addEventListener("dragover", (e) => {
      if (!solved) e.preventDefault();
    });
    card.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!solved && draggedIndex !== null && draggedIndex !== position) {
        swapPositions(draggedIndex, position);
      }
    });

    board.appendChild(card);
  });
}

function swapPositions(a, b) {
  [order[a], order[b]] = [order[b], order[a]];
  selected = null;
  render();
}

function handleCardClick(position) {
  if (flipped) return;

  if (selected === null) {
    selected = position;
    render();
    statusEl.textContent = "Keping dipilih. Klik satu lagi keping untuk bertukar tempat.";
  } else if (selected === position) {
    selected = null;
    render();
    statusEl.textContent = "Pilihan dibatalkan.";
  } else {
    swapPositions(selected, position);
    statusEl.textContent = "Keping berjaya ditukar. Teruskan menyusun!";
  }
}

function isSolved() {
  return order.every((pieceId, position) => pieceId === position);
}

function checkPuzzle() {
  if (isSolved()) {
    solved = true;
    flipBtn.disabled = false;
    statusEl.className = "status success";
    statusEl.textContent = "🎉 Tahniah! Gambar lengkap. Sekarang balikkan kepingan untuk mencari mesej rahsia.";
    messagePanel.classList.remove("hidden");
    buildMessage();
    render();
  } else {
    statusEl.className = "status error";
    statusEl.textContent = "Belum tepat. Perhatikan sambungan gambar dan cuba lagi.";
  }
}

function flipAll() {
  if (!solved) return;
  flipped = !flipped;
  flipBtn.textContent = flipped ? "↻ Tunjukkan Gambar" : "↻ Balikkan Kepingan";
  statusEl.className = "status";
  statusEl.textContent = flipped
    ? "Perkataan telah didedahkan. Baca dari kiri ke kanan, atas ke bawah."
    : "Kepingan kembali menunjukkan gambar.";
  render();
  if (flipped) {
    messagePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function buildMessage() {
  messageEl.innerHTML = "";
  WORDS.forEach((word, i) => {
    const token = document.createElement("div");
    token.className = "token";
    token.textContent = `${i + 1}. ${word}`;
    messageEl.appendChild(token);
  });
  finalMessage.textContent =
    "KERJASAMA DAPAT MENGUKUHKAN SEMANGAT PERPADUAN SERTA MEWUJUDKAN PERSEKITARAN YANG SIHAT DAN SELAMAT.";
}

function shufflePuzzle() {
  solved = false;
  flipped = false;
  selected = null;
  order = makeShuffledOrder();
  flipBtn.disabled = true;
  flipBtn.textContent = "↻ Balikkan Kepingan";
  messagePanel.classList.add("hidden");
  finalMessage.classList.add("hidden");
  statusEl.className = "status";
  statusEl.textContent = "Puzzle telah diacak. Susun 12 keping sehingga gambar lengkap.";
  render();
}

function resetPuzzle() {
  solved = false;
  flipped = false;
  selected = null;
  order = [...Array(12).keys()];
  flipBtn.disabled = true;
  flipBtn.textContent = "↻ Balikkan Kepingan";
  messagePanel.classList.add("hidden");
  finalMessage.classList.add("hidden");
  statusEl.className = "status";
  statusEl.textContent = "Puzzle diset semula. Klik “Susun Semula” untuk cabaran rawak.";
  render();
}

checkBtn.addEventListener("click", checkPuzzle);
flipBtn.addEventListener("click", flipAll);
shuffleBtn.addEventListener("click", shufflePuzzle);
resetBtn.addEventListener("click", resetPuzzle);

render();
