import Interpreter from "../tools/interpreter";

describe("Interpreter", () => {
  let ast;

  beforeEach(() => {
    // Setup AST for testing
    ast = {
      type: "Program",
      body: [],
      setup: {
        typeDefinitions: {
          number: ["shell"],
          string: ["word"],
        },
        descriptorDefinitions: ["My", "Our", "Their"],
        assignerDefinitions: ["called", "of"],
      },
    };
  });

  test("should correctly assign variable values", () => {
    ast.body.push({
      nodeType: "variableAssignment",
      descriptor: "Our",
      variableName: "Dog",
      variableType: "shell",
      assigner: "living",
      poeticCompleter: "brock",
      value: "2",
    });

    const interpreter = new Interpreter(ast);
    interpreter.interpret();

    expect(interpreter.variables["Dog"]).toBe(2);
  });

  test("should throw error when assigning value of incorrect type", () => {
    ast.body.push({
      nodeType: "variableAssignment",
      descriptor: "My",
      variableName: "Dog",
      variableType: "shell",
      assigner: "living",
      poeticCompleter: "brock",
      value: '"2"',
    });

    const interpreter = new Interpreter(ast);
    expect(() => {
      interpreter.interpret();
    }).toThrowError(TypeError);
  });

  test("should throw error Unknown custom type error when assigning value of unknown type", () => {
    ast.body.push({
      nodeType: "variableAssignment",
      descriptor: "My",
      variableName: "Dog",
      variableType: "donkey",
      assigner: "living",
      poeticCompleter: "brock",
      value: "2",
    });

    const interpreter = new Interpreter(ast);
    expect(() => {
      interpreter.interpret();
    }).toThrowError("Unknown custom type: donkey");
  });

  test("should assign string variable values", () => {
    ast.body.push({
      nodeType: "variableAssignment",
      descriptor: "Our",
      variableName: "Dog",
      variableType: "word",
      assigner: "called",
      poeticCompleter: "brock",
      value: "Brock",
    });

    const interpreter = new Interpreter(ast);
    interpreter.interpret();

    expect(interpreter.variables["Dog"]).toBe("Brock");
  });
  test("should correctly print the value of an existing variable", () => {
    // Mock console.log
    const consoleSpy = jest.spyOn(console, "log");

    // Setup: Add a variable assignment and a print statement to the AST
    ast.body.push({
      nodeType: "variableAssignment",
      descriptor: "Our",
      variableName: "Dog",
      variableType: "shell",
      assigner: "living",
      poeticCompleter: "brock",
      value: "2",
    });
    ast.body.push({
      nodeType: "printStatement",
      prePrintingCommand: "Magic words",
      printCommand: "reveal",
      content: "Dog",
      isVariable: true,
    });

    const interpreter = new Interpreter(ast);
    interpreter.interpret();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(2);

    // Restore console.log
    consoleSpy.mockRestore();
  });
  test("should throw an error for an undefined variable in a print statement", () => {
    // Setup: Add a print statement with an undefined variable
    ast.body.push({
      nodeType: "printStatement",
      prePrintingCommand: "Magic words",
      printCommand: "reveal",
      content: "Cat",
      isVariable: true,
    });

    const interpreter = new Interpreter(ast);

    // Assert: Expect an error to be thrown
    expect(() => {
      interpreter.interpret();
    }).toThrowError("Unknown variable: Cat");
  });

  test("should correctly print a direct value", () => {
    // Mock console.log
    const consoleSpy = jest.spyOn(console, "log");

    // Setup: Add a print statement for a direct value
    ast.body.push({
      nodeType: "printStatement",
      prePrintingCommand: "Magic words",
      printCommand: "reveal",
      content: "[1, 2, 3]",
      isVariable: false,
    });

    const interpreter = new Interpreter(ast);
    interpreter.interpret();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith("[1, 2, 3]");

    // Restore console.log
    consoleSpy.mockRestore();
  });
});
