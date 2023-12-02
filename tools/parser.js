import { NODE_TYPE  } from "../utils/enums.js";

/**
 * Represents a Parser object that parses tokens into an abstract syntax tree (AST).
 * @class
 */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
    this.ast = {
      type: "Program",
      body: [],
      setup: {
        typeDefinitions: {},
        descriptorDefinitions: [],
        assignerDefinitions: [],
        printingCommands: [],
        prePrintingCommands: [],
      },
    };
  }

  parse() {
    while (this.current < this.tokens.length) {
      this.walk();
    }
    return this.ast;
  }

  /**
   * Parses the type definitions from the given value.
   *
   * @param {string} value - The value containing the type definitions.
   * @returns {Object} - An object representing the parsed type definitions.
   */
  parseTypeDefinitions(value) {
    // Extract type definitions
    const typeDefs = value.replace("Define Types:", "").trim().split(";");
    const typeDefMap = {};

    typeDefs.forEach((def) => {
      if (def.trim() === "") return;
      const [types, typeName] = def.trim().split(" as ");
      typeDefMap[typeName] = types.split(",").map((type) => type.trim());
    });

    return typeDefMap;
  }

  /**
   * Parses the descriptor definitions from the given value.
   *
   * @param {string} value - The value containing the descriptor definitions.
   * @returns {string[]} An array of parsed descriptor definitions.
   */
  parseDescriptorDefinitions(value) {
    // Extract descriptor definitions
    return value
      .replace("Descriptors:", "")
      .trim()
      .replace(/;$/, "")
      .split(",")
      .map((d) => d.trim());
  }

  /**
   * Parses assigner definitions from a given value.
   *
   * @param {string} value - The value to parse assigner definitions from.
   * @returns {string[]} - An array of assigner definitions.
   */
  parseAssignerDefinitions(value) {
    return value
      .replace("Assigners:", "")
      .trim()
      .replace(/;$/, "")
      .split(",")
      .map((a) => a.trim());
  }

  /**
   * Parses the printing commands from the given value.
   * 
   * @param {string} value - The value to parse.
   * @returns {string[]} - An array of parsed printing commands.
   */
  parsePrintingCommands(value) {
    return value
      .replace("Print Commands:", "")
      .trim()
      .replace(/;$/, "")
      .split(",")
      .map((a) => a.trim());
  }

  /**
   * Parses the pre-printing commands from the given value.
   * 
   * @param {string} value - The value to parse.
   * @returns {string[]} - An array of pre-printing commands.
   */
  parsePrePrintingCommands(value) {
    return value
      .replace("Pre Printing Commands:", "")
      .trim()
      .replace(/;$/, "")
      .split(",")
      .map((a) => a.trim());
  }


  /**
   * Escapes special characters in a string for use in a regular expression.
   * @param {string} string - The input string to escape.
   * @returns {string} - The escaped string.
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special characters for regex
  }

  /**
   * Creates a regular expression from the printing and pre-printing commands defined in the AST setup.
   * @returns {RegExp} The regular expression pattern for matching printing and pre-printing commands.
   */
  createRegexFromPrintingAndPrePrintingCommands() {
    const printingCommandsPattern = this.ast.setup.printingCommands
      .map(this.escapeRegExp)
      .join("|");
    
    const prePrintingCommandsPattern = this.ast.setup.prePrintingCommands
      .map(this.escapeRegExp)
      .join("|");
    
    const pattern = `^(${prePrintingCommandsPattern}) (${printingCommandsPattern}) (\\w+|\\((.*?)\\))`;
    return new RegExp(pattern, "i"); // 'i' for case-insensitive matching
  }

  /**
   * Parses a printing statement and returns an object representing the parsed statement.
   * @param {string} value - The printing statement to be parsed.
   * @returns {object|null} - An object representing the parsed printing statement, or null if no match is found.
   */
  parsePrintingStatement(value) {
    const regex = this.createRegexFromPrintingAndPrePrintingCommands();
    const parts = value.match(regex);

    const isVariable = (value) => {
      return !(value.startsWith("(") && value.endsWith(")"));
    };

    if (parts) {
      return {
        nodeType: NODE_TYPE.PRINT_STATEMENT,
        prePrintingCommand: parts[1].trim(),
        printCommand: parts[2].trim(),
        content: parts[3].trim(), // This can be a variable name or a direct value
        isVariable: isVariable(parts[3].trim()),
      };
    } else {
      console.error("No match found for print statement:", value);
      return null;
    }
  }

  /**
   * Creates a regular expression pattern based on the descriptor, type, and assigner definitions.
   * @returns {RegExp} The regular expression pattern for matching the defined syntax.
   */
  createRegexFromDefinitions() {
    const descriptorPattern = this.ast.setup.descriptorDefinitions
      .map(this.escapeRegExp)
      .join("|");

    // Flatten the array values from typeDefinitions and join them into a regex pattern
    const typeValues = Object.values(this.ast.setup.typeDefinitions).flat();
    const typePattern = typeValues.map(this.escapeRegExp).join("|");

    const assignerPattern = this.ast.setup.assignerDefinitions
      .map(this.escapeRegExp)
      .join("|");

    const pattern = `^(${descriptorPattern}) (\\w+) is a (${typePattern}) (${assignerPattern}) ([^\\(]+) \\(([^\\)]+)\\)$`;;
    return new RegExp(pattern, "i"); // 'i' for case-insensitive matching
  }

  /**
   * Parses a variable assignment statement.
   *
   * @param {string} value - The string representation of the variable assignment statement.
   * @returns {object|null} - The parsed variable assignment object, or null if no match is found.
   */
  parseVariableAssignment(value) {
    const regex = this.createRegexFromDefinitions();
    const parts = value.match(regex);

    if (parts) {
      return {
        nodeType: NODE_TYPE.VARIABLE_ASSIGNMENT,
        descriptor: parts[1].trim(),
        variableName: parts[2].trim(),
        variableType: parts[3].trim(),
        assigner: parts[4].trim(),
        poeticCompleter: parts[5].trim(),
        value: parts[6].trim(),
      };
    } else {
      // If no match is found, it might be useful to return or log some error or information
      console.error("No match found for variable assignment:", value);
      return null;
    }
  }

  /**
   * Walks through the tokens and parses them based on their type.
   */
  walk() {
    let token = this.tokens[this.current];

    switch (token.type) {
      case NODE_TYPE.TYPE_DEFINITION:
        this.current++;
        this.ast.setup.typeDefinitions = this.parseTypeDefinitions(token.value);
        break;

      case NODE_TYPE.DESCRIPTOR_DEFINITION:
        this.current++;
        this.ast.setup.descriptorDefinitions = this.parseDescriptorDefinitions(
          token.value
        );
        break;

      case NODE_TYPE.ASSIGNER_DEFINITION:
        this.current++;
        this.ast.setup.assignerDefinitions = this.parseAssignerDefinitions(
          token.value
        );
        break;

      case NODE_TYPE.VARIABLE_ASSIGNMENT:
        this.current++;
        this.ast.body.push(this.parseVariableAssignment(token.value));
        break;
      
      case NODE_TYPE.PRINTING_COMMANDS_DEFINITION:
        this.current++;
        this.ast.setup.printingCommands = this.parsePrintingCommands(token.value);
        break;
      
      case NODE_TYPE.PRE_PRINTING_COMMANDS_DEFINITION:
        this.current++;
        this.ast.setup.prePrintingCommands = this.parsePrePrintingCommands(token.value);
        break;
      
      case NODE_TYPE.PRINT_STATEMENT:
        this.current++;
        this.ast.body.push(this.parsePrintingStatement(token.value));
        break;
      
      case NODE_TYPE.COMMENT:
        this.current++;
        break;

      default:
        throw new TypeError(`Unknown token type: ${token.type}`);
    }
  }
}

export default Parser;
