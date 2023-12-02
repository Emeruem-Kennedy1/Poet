import { NODE_TYPE } from "../utils/enums.js";

/**
 * Represents a lexer for a custom scripting language.
 * @class
 */
class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = [];
    this.isInSetupBlock = false; // Setup block flag
    this.descriptors = new Set(); // To store descriptors
    this.prePrintingCommands = new Set(); // To store pre-printing commands
    this.printCommands = new Set(); // To store print commands
    this.assigners = new Set(); // To store assigners
  }

  /**
   * Lexes the input script and generates tokens based on defined token patterns.
   * @returns {Array} The array of generated tokens.
   */
  lex() {
    const lines = this.input.split("\n");

    // Define token patterns for different parts of the script
    const tokenPatterns = {
      typeDefinition: /^Define Types:/,
      descriptorDefinition: /^Descriptors:/,
      assignerDefinition: /^Assigners:/,
      prePrintingCommandsDefinition: /^Pre Printing Commands:/,
      printingCommandsDefinition: /^Print Commands:/,
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

  /**
   * Processes a setup line based on its type and adds the corresponding token to the tokens array.
   *
   * @param {string} line - The setup line to be processed.
   * @param {object} tokenPatterns - The patterns used to determine the line type.
   * @returns {void}
   */
  processSetupLine(line, tokenPatterns) {
    // Determine the line type
    let lineType = this.getLineType(line, tokenPatterns);

    switch (lineType) {
      case NODE_TYPE.TYPE_DEFINITION:
        this.tokens.push({ type: NODE_TYPE.TYPE_DEFINITION, value: line });
        break;
      case NODE_TYPE.DESCRIPTOR_DEFINITION:
        const descriptorList = line
          .replace(tokenPatterns.descriptorDefinition, "")
          .trim()
          .replace(/;$/, "");
        descriptorList
          .split(",")
          .forEach((d) => this.descriptors.add(d.trim()));
        this.tokens.push({
          type: NODE_TYPE.DESCRIPTOR_DEFINITION,
          value: line,
        });
        break;
      case NODE_TYPE.ASSIGNER_DEFINITION:
        const assignerList = line
          .replace(tokenPatterns.assignerDefinition, "")
          .trim()
          .replace(/;$/, "");
        assignerList.split(",").forEach((a) => this.assigners.add(a.trim()));
        this.tokens.push({ type: NODE_TYPE.ASSIGNER_DEFINITION, value: line });
        break;
      case NODE_TYPE.PRE_PRINTING_COMMANDS_DEFINITION:
        const prePrintingCommandList = line
          .replace(tokenPatterns.prePrintingCommandsDefinition, "")
          .trim()
          .replace(/;$/, "");
        prePrintingCommandList
          .split(",")
          .forEach((c) => this.prePrintingCommands.add(c.trim()));
        this.tokens.push({
          type: NODE_TYPE.PRE_PRINTING_COMMANDS_DEFINITION,
          value: line,
        });
        break;
      case NODE_TYPE.PRINTING_COMMANDS_DEFINITION:
        const printingCommandList = line
          .replace(tokenPatterns.printingCommandsDefinition, "")
          .trim()
          .replace(/;$/, "");
        printingCommandList
          .split(",")
          .forEach((c) => this.printCommands.add(c.trim()));
        this.tokens.push({
          type: NODE_TYPE.PRINTING_COMMANDS_DEFINITION,
          value: line,
        });
        break;

      // Optionally handle other cases or default case
    }
  }

  /**
   * Determines the type of a given line based on the provided token patterns.
   * @param {string} line - The line to determine the type of.
   * @param {object} tokenPatterns - The token patterns used for matching.
   * @returns {string|null} - The type of the line, or null if no match is found.
   */
  getLineType(line, tokenPatterns) {
    if (line.match(tokenPatterns.typeDefinition)) {
      return NODE_TYPE.TYPE_DEFINITION;
    } else if (line.match(tokenPatterns.descriptorDefinition)) {
      return NODE_TYPE.DESCRIPTOR_DEFINITION;
    } else if (line.match(tokenPatterns.assignerDefinition)) {
      return NODE_TYPE.ASSIGNER_DEFINITION;
    } else if (line.match(tokenPatterns.prePrintingCommandsDefinition)) {
      return NODE_TYPE.PRE_PRINTING_COMMANDS_DEFINITION;
    } else if (line.match(tokenPatterns.printingCommandsDefinition)) {
      return NODE_TYPE.PRINTING_COMMANDS_DEFINITION;
    }
    // Add more cases as needed
    return null; // or a default type
  }

  /**
   * Determines the type of a line outside of the setup section.
   * @param {string} line - The line of code to analyze.
   * @param {object} tokenPatterns - The token patterns used for matching.
   * @returns {string|null} - The type of the line or null if it doesn't match any known types.
   */
  getLineTypeOutsideSetup(line, tokenPatterns) {
    tokenPatterns.variableAssignment = this.constructVarAssignmentRegex();
    const matchVarAssignment = line.match(tokenPatterns.variableAssignment);
    const matchComment = line.match(tokenPatterns.comment);
    const matchPrintStatement = this.isPrintStatement(line);

    if (matchVarAssignment) {
      return NODE_TYPE.VARIABLE_ASSIGNMENT;
    } else if (matchComment) {
      return NODE_TYPE.COMMENT;
    } else if (matchPrintStatement) {
      return NODE_TYPE.PRINT_STATEMENT;
    } else if (line.trim() !== "") {
      return NODE_TYPE.UNKNOWN;
    }

    return null; // or a default type
  }

  /**
   * Processes a line outside of the setup section.
   * Determines the type of the line and adds it to the tokens array accordingly.
   *
   * @param {string} line - The line to process.
   * @param {object} tokenPatterns - The token patterns used for line type detection.
   * @returns {void}
   */
  processOutsideSetupLine(line, tokenPatterns) {
    const lineType = this.getLineTypeOutsideSetup(line, tokenPatterns);
    switch (lineType) {
      case NODE_TYPE.VARIABLE_ASSIGNMENT:
        this.tokens.push({ type: NODE_TYPE.VARIABLE_ASSIGNMENT, value: line });
        break;
      case NODE_TYPE.COMMENT:
        this.tokens.push({ type: NODE_TYPE.COMMENT, value: line });
        break;
      case NODE_TYPE.UNKNOWN:
        this.tokens.push({ type: NODE_TYPE.UNKNOWN, value: line });
        break;
      case NODE_TYPE.PRINT_STATEMENT:
        this.tokens.push({ type: NODE_TYPE.PRINT_STATEMENT, value: line });
        break;
      // Optionally handle other cases or default case
    }
  }

  /**
   * Constructs a regular expression for variable assignment.
   * @returns {RegExp|null} The regular expression for variable assignment, or null if there are no descriptors.
   */
  constructVarAssignmentRegex() {
    if (this.descriptors.size === 0) return null;
    const descriptorPattern = Array.from(this.descriptors).join("|");
    const assignerPattern = Array.from(this.assigners).join("|");
    return new RegExp(
      `^(${descriptorPattern}) (\\w+) is a (\\w+) (${assignerPattern}) (.+) \\((.+)\\)$`
    );
  }

  constructPrintStatementRegex() {
    // Ensure there are commands to construct the regex
    if (this.prePrintingCommands.size === 0 || this.printCommands.size === 0)
      return null;

    // Create regex patterns for pre-printing and print commands
    const prePrintingCommandPattern = Array.from(this.prePrintingCommands).join(
      "|"
    );
    const printCommandPattern = Array.from(this.printCommands).join("|");

    // Construct and return the regex for a print statement
    return new RegExp(
      `^(${prePrintingCommandPattern}) (${printCommandPattern}) (.+)$`
    );
  }

  isPrintStatement(line) {
    const printStatementRegex = this.constructPrintStatementRegex();
    if (!printStatementRegex) return false;

    return printStatementRegex.test(line);
  }
}

export default Lexer;
