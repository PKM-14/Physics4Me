const express = require("express");
const app = express();
const PORT = 3000;

const conceptRoutes = require("./routes/concepts");

app.use(express.json());

// Routes
app.use("/api/concepts", conceptRoutes);

// Root check
app.get("/", (req, res) => {
  res.send("Physics Concept API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
