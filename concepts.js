const express = require("express");
const router = express.Router();

const {
  getAllConcepts,
  getConceptById
} = require("../controllers/conceptsController");

router.get("/", getAllConcepts);
router.get("/:id", getConceptById);

module.exports = router;
