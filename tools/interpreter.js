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
      case NODE_TYPE.PRINT_STATEMENT:
        this.handlePrintStatement(node);
        break;
      // TODO:Add more cases here for other types of nodes
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * Handles the print statement by logging the content to the console.
   * If the content is a variable, it retrieves its value from the variables object and logs the parsed value.
   * @param {Object} node - The node representing the print statement.
   * @param {string} node.content - The content to be printed.
   * @param {boolean} node.isVariable - Indicates whether the content is a variable.
   * @throws {Error} If the content is a variable and it is not found in the variables object.
   */
  handlePrintStatement(node) {
    const { content, isVariable } = node;

    if (!isVariable) {
      console.log(`${content}`);
      return;
    }

    // If the content is a variable, get its value from the variables object
    if (!this.variables.hasOwnProperty(content)) {
      throw new Error(`Unknown variable: ${content}`);
    }
    
    const parser = new SmartDataStructureParser();
    const variableValue = this.variables[content];
    const parsedValue = parser.parse(variableValue);

    console.log(parsedValue);
  }

  /**
   * Creates a custom type to JavaScript type map based on the provided type definitions.
   * @param {Object} typeDefinitions - The type definitions to be mapped.
   * @returns {Object} - The custom type to JavaScript type map.
   */
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

  /**
   * Interprets and assigns a value to a variable.
   * 
   * @param {Object} node - The node representing the variable assignment.
   * @param {string} node.variableName - The name of the variable.
   * @param {string} node.value - The value to be assigned to the variable.
   * @param {string} node.variableType - The expected type of the variable.
   * @throws {TypeError} If the assigned value does not match the expected type.
   */
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

  /**
   * Checks if the given custom type is valid for the actual value.
   * @param {string} customType - The custom type to check.
   * @param {*} actualValue - The actual value to validate against the custom type.
   * @returns {boolean} - Returns true if the actual value's type matches the expected JavaScript type for the custom type, otherwise false.
   * @throws {Error} - Throws an error if the custom type is unknown.
   */
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
