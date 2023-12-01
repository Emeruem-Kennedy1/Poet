export default function lexer(input) {
  const tokens = [];
  const lines = input.split("\n");

  let isInSetupBlock = false; // Setup block flag
  let descriptors = new Set(); // To store descriptors

  // Define token patterns for different parts of the script
  const tokenPatterns = {
    typeDefinition: /^Define Types:/,
    descriptorDefinition: /^Descriptors:/,
    assignerDefinition: /^Assigners:/,
    comment: /^#.*$/,
    // variableAssignment pattern will be dynamically constructed
  };

  // Dynamically construct the regex for variable assignment based on descriptors
  function constructVarAssignmentRegex() {
    if (descriptors.size === 0) return null;
    const descriptorPattern = Array.from(descriptors).join("|");
    return new RegExp(
      `^(${descriptorPattern}) \\w+ is a \\w+ called .+ \\(\\d+\\)`
    );
  }

  lines.forEach((line) => {
    // Detect start and end of setup block
    if (line.trim() === "--start setup") {
      isInSetupBlock = true;
      return;
    } else if (line.trim() === "--end setup") {
      isInSetupBlock = false;
      return;
    }

    if (isInSetupBlock) {
      // Process setup lines
      if (line.match(tokenPatterns.typeDefinition)) {
        tokens.push({ type: "typeDefinition", value: line });
      } else if (line.match(tokenPatterns.descriptorDefinition)) {
        const descriptorList = line
          .replace(tokenPatterns.descriptorDefinition, "")
          .trim();
        descriptorList.split(",").forEach((d) => descriptors.add(d.trim()));
        tokens.push({ type: "descriptorDefinition", value: line });
      } else if (line.match(tokenPatterns.assignerDefinition)) {
        tokens.push({ type: "assignerDefinition", value: line });
      }
    } else {
      // Process lines outside the setup block
      tokenPatterns.variableAssignment = constructVarAssignmentRegex();
      const matchVarAssignment = line.match(tokenPatterns.variableAssignment);
      const matchComment = line.match(tokenPatterns.comment);

      if (matchVarAssignment) {
        tokens.push({ type: "variableAssignment", value: line });
      } else if (matchComment) {
        tokens.push({ type: "comment", value: line });
      } else if (line.trim() !== "") {
        tokens.push({ type: "unknown", value: line });
      }
    }
  });

  return tokens;
}
