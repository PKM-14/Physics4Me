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
// Create canvas helper
// --------------------
function createCanvas(id) {
  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = 600;
  canvas.height = 300;
  canvas.style.border = "1px solid #30363d";
  canvas.style.marginTop = "20px";
  document.getElementById("content").appendChild(canvas);
  return canvas;
}

// --------------------
// INIT ALL VISUALS
// --------------------
function initVisuals() {
  wireVisual(createCanvas("wire"));
  solenoidVisual(createCanvas("solenoid"));
  magnetVisual(createCanvas("magnet"));
  lorentzVisual(createCanvas("lorentz"));
}

// --------------------
// 1. Wire
// --------------------
function wireVisual(canvas) {
  const ctx = canvas.getContext("2d");
  let particles = Array.from({ length: 80 }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 40 + Math.random() * 120
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
// 2. Solenoid (UPGRADED)
// --------------------
function solenoidVisual(canvas) {
  const ctx = canvas.getContext("2d");
  let phase = 0;

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    for (let i = 0; i < 10; i++) {
      let x = 50 + i * 50;

      ctx.beginPath();
      ctx.arc(x, 150, 20, 0, 2 * Math.PI);
      ctx.strokeStyle = "#58a6ff";
      ctx.stroke();

      // moving particles inside
      let y = 150 + 10 * Math.sin(phase + i);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#e6edf3";
      ctx.fill();
    }

    // internal field indicator
    ctx.fillStyle = "#58a6ff";
    ctx.fillRect(100, 130, 400, 40);

    phase += 0.05;
    requestAnimationFrame(draw);
  }

  draw();
}

// --------------------
// 3. Magnet domains
// --------------------
function magnetVisual(canvas) {
  const ctx = canvas.getContext("2d");
  let aligned = false;

  canvas.onclick = () => aligned = !aligned;

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    for (let x = 60; x < 540; x += 40) {
      for (let y = 60; y < 240; y += 40) {
        let angle = aligned ? 0 : Math.random() * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 20 * Math.cos(angle), y + 20 * Math.sin(angle));
        ctx.strokeStyle = "#58a6ff";
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#e6edf3";
    ctx.fillText(aligned ? "Aligned → Magnet" : "Random → No Magnet", 180, 280);

    requestAnimationFrame(draw);
  }

  draw();
}

// --------------------
// 4. Lorentz force demo
// --------------------
function lorentzVisual(canvas) {
  const ctx = canvas.getContext("2d");

  let particle = { x: 50, y: 150, vx: 2, vy: 0 };

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    // magnetic field (into page)
    ctx.fillStyle = "#58a6ff";
    for (let x = 0; x < 600; x += 40) {
      for (let y = 0; y < 300; y += 40) {
        ctx.fillText("×", x, y);
      }
    }

    // Lorentz force (simple circular motion)
    let ax = -particle.vy * 0.05;
    let ay = particle.vx * 0.05;

    particle.vx += ax;
    particle.vy += ay;

    particle.x += particle.vx;
    particle.y += particle.vy;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#e6edf3";
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
}
