import lexer from "../lexer";

describe("Lexer", () => {
  const inputFile = `--start setup
\nDefine Types: word1, word2, word3 as Arrays; word4, word5 as Integer;
\nDescriptors: My, Our, Their;
\nAssigners: called, of;
\n--end setup\n# Define variables
\nMy house is a shell called my former self (1)
\nmore variables`;
  test("should return something", () => {
    expect(lexer(inputFile)).not.toBeUndefined();
  });

  test("should return an array", () => {
    expect(lexer(inputFile)).toBeInstanceOf(Array);
  });

  test("should contain typeDefinition token", () => {
    expect(lexer(inputFile)).toContainEqual({
      type: "typeDefinition",
      value:
        "Define Types: word1, word2, word3 as Arrays; word4, word5 as Integer;",
    });
  });
    
    test("should contain descriptorDefinition token", () => {
        expect(lexer(inputFile)).toContainEqual({
        type: "descriptorDefinition",
        value: "Descriptors: My, Our, Their;",
        });
    });

    test("should contain assignerDefinition token", () => {
        expect(lexer(inputFile)).toContainEqual({
        type: "assignerDefinition",
        value: "Assigners: called, of;",
        });
    });

    test("should contain variableAssignment token", () => {
        expect(lexer(inputFile)).toContainEqual({
        type: "variableAssignment",
        value: "My house is a shell called my former self (1)",
        });
    });

    test("should contain comment token", () => {
        expect(lexer(inputFile)).toContainEqual({
        type: "comment",
        value: "# Define variables",
        });
    });

    test("should contain unknown token", () => {
        expect(lexer(inputFile)).toContainEqual({
        type: "unknown",
        value: "more variables",
        });
    });
});
