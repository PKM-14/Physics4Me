const DATA_URL = "concepts.json";

// --------------------
// Detect page type
// --------------------
const isConceptPage =
  document.getElementById("title") && document.getElementById("content");

if (isConceptPage) {
  loadConceptPage();
} else {
  loadConcepts();
}

// --------------------
// Load homepage cards
// --------------------
async function loadConcepts() {
  const container = document.getElementById("concept-list");
  if (!container) return;

  try {
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
  } catch (err) {
    console.error("Error loading concepts:", err);
    container.innerText = "Failed to load concepts.";
  }
}

// --------------------
// Load individual concept page
// --------------------
async function loadConceptPage() {
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");

  if (!titleEl || !contentEl) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      contentEl.innerText = "No concept selected.";
      return;
    }

    const res = await fetch(DATA_URL);
    const concepts = await res.json();

    const concept = concepts.find(c => c.id === id);

    if (!concept) {
      contentEl.innerText = "Concept not found.";
      return;
    }

    // Set title
    titleEl.innerText = concept.title;

    // Clear previous content
    contentEl.innerHTML = "";

    concept.sections.forEach(section => {
      const div = document.createElement("div");
      div.className = "section";

      div.innerHTML = `<h2>${section.title}</h2><p>${section.content}</p>`;
      contentEl.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading concept:", err);
    contentEl.innerText = "Failed to load concept.";
  }
}

// --------------------
// Magnetic field visual with slider
// --------------------
function initMagneticVisual() {
  const canvas = document.getElementById("magnetic-canvas");
  const slider = document.getElementById("currentSlider");
  if (!canvas || !slider) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const wireX = width / 2;
  const wireY = height / 2;
  const particleCount = 80;
  const particles = [];

  // Initialize particles randomly around the wire
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 50 + Math.random() * 120;
    particles.push({ angle, radius });
  }

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, width, height);

    // Draw wire
    ctx.fillStyle = "#e6edf3";
    ctx.fillRect(wireX - 3, 0, 6, height);

    // Particle speed depends on slider value (current strength)
    const current = parseFloat(slider.value);
    particles.forEach(p => {
      const speed = (0.02 * current) / (p.radius / 100);
      p.angle += speed;

      const x = wireX + p.radius * Math.cos(p.angle);
      const y = wireY + p.radius * Math.sin(p.angle);

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
// Only run visual for magnetic-field concept
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id === "magnetic-field") {
    initMagneticVisual();
  }
});
