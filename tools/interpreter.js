import SmartDataStructureParser from "../utils/smartDataStructureParser";
import { NODE_TYPE } from "../utils/enums";

/**
 * Represents an interpreter for executing a given Abstract Syntax Tree (AST).
 * @class
 */
class Interpreter {
  constructor(ast) {
    this.ast = ast;
    this.variables = {}; // To store variable values
    this.typeDefinitions = this.ast.setup.typeDefinitions;

    // Mapping custom types to JavaScript types
    this.customTypeToJSType = this.createCustomTypeToJSTypeMap(
      ast.setup.typeDefinitions
    );
  }

  interpret() {
    // Iterate over each node in the AST body
    this.ast.body.forEach((node) => {
      if (node) {
        this.interpretNode(node);
      }
    });
  }

  interpretNode(node) {
    switch (node.nodeType) {
      case NODE_TYPE.VARIABLE_ASSIGNMENT:
        this.interpretVariableAssignment(node);
        break;
      // Add more cases here for other types of nodes
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  createCustomTypeToJSTypeMap(typeDefinitions) {
    // Flattening the type definitions and mapping them to their JavaScript types
    let map = {};
    for (let jsType in typeDefinitions) {
      typeDefinitions[jsType].forEach((customType) => {
        map[customType] = jsType;
      });
    }
    return map;
  }

  interpretVariableAssignment(node) {
    const { variableName, value, variableType } = node;
    const parser = new SmartDataStructureParser();

    // parse the value to the correct type
    const parsedValue = parser.parse(value);

    // Perform type checking
    if (!this.isTypeValid(variableType, parsedValue)) {
      throw new TypeError(
        `Type mismatch: Expected ${variableType} for variable ${variableName}`
      );
    }

    this.variables[variableName] = parsedValue;
  }

  isTypeValid(customType, actualValue) {
    // Check if the custom type is defined

    if (!this.customTypeToJSType.hasOwnProperty(customType)) {
      throw new Error(`Unknown custom type: ${customType}`);
    }

    // Get the expected JavaScript type for the custom type
    const expectedJSType = this.customTypeToJSType[customType];

    // Determine the JavaScript type of the actual value
    let actualValueType = typeof actualValue;

    // Special case for null and arrays
    if (actualValue === null) {
      actualValueType = "null";
    } else if (Array.isArray(actualValue)) {
      actualValueType = "Array";
    }

    // Check if the actual value's type matches the expected JavaScript type
    return expectedJSType === actualValueType;
  }

  // Add more methods here for interpreting other types of nodes
}

export default Interpreter;
