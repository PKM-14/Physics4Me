const DATA_URL = "concepts.json";

const isConceptPage =
  document.getElementById("title") && document.getElementById("content");

if (isConceptPage) loadConceptPage();
else loadConcepts();

// --------------------
// HOMEPAGE
// --------------------
async function loadConcepts() {
  const container = document.getElementById("concept-list");
  const res = await fetch(DATA_URL);
  const concepts = await res.json();

  concepts.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h2>${c.title}</h2>
      <p>${c.description}</p>
      <small>${c.difficulty}</small>
    `;

    div.onclick = () => {
      window.location.href = `concept.html?id=${c.id}`;
    };

    container.appendChild(div);
  });
}

// --------------------
// CONCEPT PAGE
// --------------------
async function loadConceptPage() {
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");
  const metaEl = document.getElementById("meta");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const res = await fetch(DATA_URL);
  const concepts = await res.json();
  const concept = concepts.find(c => c.id === id);

  titleEl.innerText = concept.title;

  // Core idea
  metaEl.innerHTML = `
    <div class="meta-box">
      <strong>Core Idea:</strong> ${concept.coreIdea}
    </div>
    <div class="meta-box">
      <strong>Common Misconceptions:</strong>
      <ul>${concept.misconceptions.map(m => `<li>${m}</li>`).join("")}</ul>
    </div>
  `;

  // Sections
  concept.sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "section";
    div.innerHTML = `<h2>${section.title}</h2><p>${section.content}</p>`;
    contentEl.appendChild(div);
  });

  initChallenge(concept.challenges);
}

// --------------------
// CHALLENGE SYSTEM
// --------------------
let currentAnswer = true;

function initChallenge(challenges) {
  const q = challenges[Math.floor(Math.random() * challenges.length)];
  currentAnswer = q.a;

  document.getElementById("question").innerText = q.q;
}

function checkAnswer(ans) {
  const feedback = document.getElementById("feedback");

  feedback.innerText =
    ans === currentAnswer
      ? "Correct — strong understanding."
      : "Incorrect — rethink the concept.";
}
