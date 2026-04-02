const concepts = require("../data/concepts.json");

// Get all concepts (lightweight preview)
exports.getAllConcepts = (req, res) => {
  const preview = concepts.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description
  }));

  res.json(preview);
};

// Get full concept
exports.getConceptById = (req, res) => {
  const concept = concepts.find(c => c.id === req.params.id);

  if (!concept) {
    return res.status(404).json({ error: "Concept not found" });
  }

  res.json(concept);
};
