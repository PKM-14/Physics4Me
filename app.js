const DATA_URL = "concepts.json";

// Detect page
const isHomePage =
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html";

if (isHomePage) {
  loadConcepts();
} else {
  loadConceptPage();
}

// Load homepage
async function loadConcepts() {
  try {
    const res = await fetch(DATA_URL);
    const concepts = await res.json();

    const container = document.getElementById("concept-list");

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
    document.getElementById("concept-list").innerText =
      "Failed to load concepts.";
  }
}

// Load individual concept
async function loadConceptPage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(DATA_URL);
    const concepts = await res.json();

    const concept = concepts.find(c => c.id === id);

    if (!concept) {
      document.getElementById("content").innerText = "Concept not found.";
      return;
    }

    document.getElementById("title").innerText = concept.title;

    const container = document.getElementById("content");

    concept.sections.forEach(section => {
      const div = document.createElement("div");
      div.className = "section";

      div.innerHTML = `<h2>${section.title}</h2><p>${section.content}</p>`;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading concept:", err);
    document.getElementById("content").innerText =
      "Failed to load concept.";
  }
}
