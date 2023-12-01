const ASSIGNER_DEFINITIONS = "assignerDefinition";
const DESCRIPTOR_DEFINITIONS = "descriptorDefinition";
const TYPE_DEFINITIONS = "typeDefinition";
const VARIABLE_ASSIGNMENT = "variableAssignment";

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
      },
    };
  }

  parse() {
    while (this.current < this.tokens.length) {
      this.walk();
    }
    return this.ast;
  }

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

  parseDescriptorDefinitions(value) {
    // Extract descriptor definitions
    return value
      .replace("Descriptors:", "")
      .trim()
      .split(",")
      .map((d) => d.trim());
  }

  parseAssignerDefinitions(value) {
    // Extract assigner definitions
    return value
      .replace("Assigners:", "")
      .trim()
      .split(",")
      .map((a) => a.trim());
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special characters for regex
  }

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

    const pattern = `^(${descriptorPattern}) (\\w+) is a (${typePattern}) (${assignerPattern}) ([\\w\\s]+) \\((\\d+)\\)$`;
    return new RegExp(pattern, "i"); // 'i' for case-insensitive matching
  }

  parseVariableAssignment(value) {
    const regex = this.createRegexFromDefinitions();
    const parts = value.match(regex);

    if (parts) {
      return {
        nodeType: VARIABLE_ASSIGNMENT,
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

  walk() {
    let token = this.tokens[this.current];

    switch (token.type) {
      case TYPE_DEFINITIONS:
        this.current++;
        this.ast.setup.typeDefinitions = this.parseTypeDefinitions(token.value);
        break;

      case DESCRIPTOR_DEFINITIONS:
        this.current++;
        this.ast.setup.descriptorDefinitions = this.parseDescriptorDefinitions(
          token.value
        );
        break;

      case ASSIGNER_DEFINITIONS:
        this.current++;
        this.ast.setup.assignerDefinitions = this.parseAssignerDefinitions(
          token.value
        );
        break;

      case VARIABLE_ASSIGNMENT:
        this.current++;
        this.ast.body.push(this.parseVariableAssignment(token.value));
        break;

      default:
        throw new TypeError(`Unknown token type: ${token.type}`);
    }
  }
}

export default Parser;
