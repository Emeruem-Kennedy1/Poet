import { NODE_TYPE } from "../utils/enums";

class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = [];
    this.isInSetupBlock = false; // Setup block flag
    this.descriptors = new Set(); // To store descriptors
  }

  // Method to lex the input
  lex() {
    const lines = this.input.split("\n");

    // Define token patterns for different parts of the script
    const tokenPatterns = {
      typeDefinition: /^Define Types:/,
      descriptorDefinition: /^Descriptors:/,
      assignerDefinition: /^Assigners:/,
      comment: /^#.*$/,
      // variableAssignment pattern will be dynamically constructed
    };

    lines.forEach((line) => {
      // Detect start and end of setup block
      if (line.trim() === "--start setup") {
        this.isInSetupBlock = true;
        return;
      } else if (line.trim() === "--end setup") {
        this.isInSetupBlock = false;
        return;
      }

      if (this.isInSetupBlock) {
        this.processSetupLine(line, tokenPatterns);
      } else {
        this.processOutsideSetupLine(line, tokenPatterns);
      }
    });

    return this.tokens;
  }

  processSetupLine(line, tokenPatterns) {
    if (line.match(tokenPatterns.typeDefinition)) {
      this.tokens.push({ type: NODE_TYPE.TYPE_DEFINITION, value: line });
    } else if (line.match(tokenPatterns.descriptorDefinition)) {
      const descriptorList = line
        .replace(tokenPatterns.descriptorDefinition, "")
        .trim();
      descriptorList.split(",").forEach((d) => this.descriptors.add(d.trim()));
      this.tokens.push({ type: NODE_TYPE.DESCRIPTOR_DEFINITION, value: line });
    } else if (line.match(tokenPatterns.assignerDefinition)) {
      this.tokens.push({ type: NODE_TYPE.ASSIGNER_DEFINITION, value: line });
    }
  }

  processOutsideSetupLine(line, tokenPatterns) {
    tokenPatterns.variableAssignment = this.constructVarAssignmentRegex();
    const matchVarAssignment = line.match(tokenPatterns.variableAssignment);
    const matchComment = line.match(tokenPatterns.comment);

    if (matchVarAssignment) {
      this.tokens.push({ type: NODE_TYPE.VARIABLE_ASSIGNMENT, value: line });
    } else if (matchComment) {
      this.tokens.push({ type: NODE_TYPE.COMMENT, value: line });
    } else if (line.trim() !== "") {
      this.tokens.push({ type: NODE_TYPE.UNKNOWN, value: line });
    }
  }

  constructVarAssignmentRegex() {
    if (this.descriptors.size === 0) return null;
    const descriptorPattern = Array.from(this.descriptors).join("|");
    return new RegExp(
      `^(${descriptorPattern}) \\w+ is a \\w+ called .+ \\(\\d+\\)`
    );
  }
}

export default Lexer;