import Parser from "../tools/parser"; // Adjust the import path as needed

describe("Parser", () => {
  test("should correctly parse type, descriptor, and assigner definitions", () => {
    const tokens = [
      {
        type: "typeDefinition",
        value: "Define Types: word1, word2 as Arrays; word3 as Integer",
      },
      { type: "descriptorDefinition", value: "Descriptors: My, Our, Their" },
      { type: "assignerDefinition", value: "Assigners: called, of" },
    ];
    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(ast.setup.typeDefinitions).toEqual({
      Arrays: ["word1", "word2"],
      Integer: ["word3"],
    });
    expect(ast.setup.descriptorDefinitions).toEqual(["My", "Our", "Their"]);
    expect(ast.setup.assignerDefinitions).toEqual(["called", "of"]);
  });

  test("should correctly parse variable assignment", () => {
    const tokens = [
      {
        type: "typeDefinition",
        value: "Define Types: shell, rock as Integer",
      },
      { type: "descriptorDefinition", value: "Descriptors: My, Our, Their" },
      { type: "assignerDefinition", value: "Assigners: called, of, living" },
      {
        type: "variableAssignment",
        value: "My house is a shell called my former self (1)",
      },
      {
        type: "variableAssignment",
        value: "Our Dog is a rock living brock (2)",
      },
    ];
    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(ast.body).toEqual([
      {
        nodeType: "variableAssignment",
        descriptor: "My",
        variableName: "house",
        variableType: "shell",
        assigner: "called",
        poeticCompleter: "my former self",
        value: "1",
      },
      {
        nodeType: "variableAssignment",
        descriptor: "Our",
        variableName: "Dog",
        variableType: "rock",
        assigner: "living",
        poeticCompleter: "brock",
        value: "2",
      },
    ]);
  });

  test("should correctly parse printing commands", () => {
    const tokens = [
      {
        type: "typeDefinition",
        value: "Define Types: shell, rock as Integer",
      },
      { type: "descriptorDefinition", value: "Descriptors: My, Our, Their" },
      { type: "assignerDefinition", value: "Assigners: called, of, living" },
      {
        type: "prePrintingCommandsDefinition",
        value: "Pre Printing Commands: Magic words, Secret code",
      },
      {
        type: "printingCommandsDefinition",
        value: "Print Commands: reveal, speak",
      },
      {
        type: "variableAssignment",
        value: "Our Dog is a rock living brock (2)",
      },
      {
        type: "printStatement",
        value: "Magic words reveal (1)",
      },
      {
        type: "printStatement",
        value: "Secret code speak ([1, 2, 3])",
      },
      {
        type: "printStatement",
        value: "Magic words reveal Dog",
      }
    ];
    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(ast.setup.prePrintingCommands).toEqual([
      "Magic words",
      "Secret code",
    ]);
    expect(ast.setup.printingCommands).toEqual(["reveal", "speak"]);
    expect(ast.body).toEqual([
      {
        nodeType: "variableAssignment",
        descriptor: "Our",
        variableName: "Dog",
        variableType: "rock",
        assigner: "living",
        poeticCompleter: "brock",
        value: "2",
      },
      {
        nodeType: "printStatement",
        printCommand: "reveal",
        prePrintingCommand: "Magic words",
        content: "(1)",
        isVariable: false,
      },
      {
        nodeType: "printStatement",
        printCommand: "speak",
        prePrintingCommand: "Secret code",
        content: "([1, 2, 3])",
        isVariable: false,
      },
      {
        nodeType: "printStatement",
        printCommand: "reveal",
        prePrintingCommand: "Magic words",
        content: "Dog",
        isVariable: true,
      }
    ]);
  });

  // TODO: Add more tests
});
