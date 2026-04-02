exports.validateConcept = (concept) => {
  if (!concept.id || !concept.title || !concept.sections) {
    return false;
  }
  return true;
};
