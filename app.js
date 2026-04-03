const DATA_URL = "concepts.json";

// --------------------
// Page detection
// --------------------
const isConceptPage =
  document.getElementById("title") && document.getElementById("content");

if (isConceptPage) {
  loadConceptPage();
} else {
  loadConcepts();
}

// --------------------
// Homepage
// --------------------
async function loadConcepts() {
  const container = document.getElementById("concept-list");
  if (!container) return;

  const res = await fetch(DATA_URL);
  const concepts = await res.json();

  concepts.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `<h2>${c.title}</h2><p>${c.description}</p>`;
    div.onclick = () => {
      window.location.href = `concept.html?id=${c.id}`;
    };

    container.appendChild(div);
  });
}

// --------------------
// Concept page
// --------------------
async function loadConceptPage() {
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const res = await fetch(DATA_URL);
  const concepts = await res.json();
  const concept = concepts.find(c => c.id === id);

  if (!concept) {
    contentEl.innerText = "Concept not found.";
    return;
  }

  titleEl.innerText = concept.title;
  contentEl.innerHTML = "";

  concept.sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "section";

    div.innerHTML = `<h2>${section.title}</h2><p>${section.content}</p>`;
    contentEl.appendChild(div);
  });

  initVisuals();
}

// --------------------
// VISUALS
// --------------------
function initVisuals() {
  createCanvas("wireCanvas");
  createCanvas("solenoidCanvas");
  createCanvas("magnetCanvas");

  wireVisual();
  solenoidVisual();
  magnetVisual();
}

// Create canvas dynamically
function createCanvas(id) {
  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = 600;
  canvas.height = 300;
  canvas.style.border = "1px solid #30363d";
  canvas.style.marginTop = "20px";
  document.getElementById("content").appendChild(canvas);
}

// --------------------
// 1. Wire visual
// --------------------
function wireVisual() {
  const canvas = document.getElementById("wireCanvas");
  const ctx = canvas.getContext("2d");

  let particles = Array.from({ length: 60 }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 40 + Math.random() * 100
  }));

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    ctx.fillStyle = "#e6edf3";
    ctx.fillRect(295, 0, 10, 300);

    particles.forEach(p => {
      p.angle += 0.03;

      const x = 300 + p.radius * Math.cos(p.angle);
      const y = 150 + p.radius * Math.sin(p.angle);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#58a6ff";
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// --------------------
// 2. Solenoid visual
// --------------------
function solenoidVisual() {
  const canvas = document.getElementById("solenoidCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    for (let i = 0; i < 8; i++) {
      const x = 80 + i * 60;

      ctx.beginPath();
      ctx.arc(x, 150, 20, 0, 2 * Math.PI);
      ctx.strokeStyle = "#58a6ff";
      ctx.stroke();
    }

    ctx.fillStyle = "#e6edf3";
    ctx.fillText("Strong uniform field inside", 180, 50);

    requestAnimationFrame(draw);
  }

  draw();
}

// --------------------
// 3. Bar magnet (domains)
// --------------------
function magnetVisual() {
  const canvas = document.getElementById("magnetCanvas");
  const ctx = canvas.getContext("2d");

  let aligned = false;

  canvas.onclick = () => {
    aligned = !aligned;
  };

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    for (let x = 50; x < 550; x += 40) {
      for (let y = 50; y < 250; y += 40) {
        let angle = aligned ? 0 : Math.random() * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 20 * Math.cos(angle), y + 20 * Math.sin(angle));
        ctx.strokeStyle = "#58a6ff";
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#e6edf3";
    ctx.fillText(aligned ? "Aligned domains → Magnet" : "Random domains → No magnet", 150, 280);

    requestAnimationFrame(draw);
  }

  draw();
}
