const DATA_URL = "concepts.json";

// Detect concept page by checking for elements
const isConceptPage =
  document.getElementById("title") && document.getElementById("content");

if (isConceptPage) {
  loadConceptPage();
} else {
  loadConcepts();
}

// Load homepage
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

// Load individual concept
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

    titleEl.innerText = concept.title;
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
