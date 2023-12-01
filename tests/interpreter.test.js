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
});
