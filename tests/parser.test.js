import Parser from "../parser"; // Adjust the import path as needed

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
      { type: "assignerDefinition", value: "Assigners: called, of" },
      {
        type: "variableAssignment",
        value: "My house is a shell called my former self (1)",
        },
        {
            type: "variableAssignment",
            value: "My Dog is a rock called brock (2)",
      }
    ];
    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(ast.body).toEqual([
      {
        descriptor: "My",
        variableName: "house",
        type: "shell",
        assigner: "called",
        poeticCompleter: "my former self",
        value: 1,
        },
        {
            descriptor: "My",
            variableName: "Dog",
            type: "rock",
            assigner: "called",
            poeticCompleter: "brock",
            value: 2,
        }
    ]);
  });

  // Add more tests for other aspects of your language as needed
});
