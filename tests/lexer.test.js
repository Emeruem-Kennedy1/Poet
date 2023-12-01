import Lexer from "../tools/lexer";

describe("Lexer", () => {
  const inputFile = `--start setup
\nDefine Types: word1, word2, word3 as Arrays; word4, word5 as Integer;
\nDescriptors: My, Our, Their;
\nAssigners: called, of;\n
Pre Printing Commands: Magic words, Secret code;\n
Print Commands: reveal, speak;\n
\n--end setup\n# Define variables
\nMy house is a shell called my former self (1)
\nMagic words reveal ('A message to the world')
\nmore variables`;
  
  const lexer = new Lexer(inputFile);
  const tokens = lexer.lex();

  console.log(tokens);
  
  test("should return something", () => {
    expect(tokens).not.toBeUndefined();
  });

  test("should return an array", () => {
    expect(tokens).toBeInstanceOf(Array);
  });

  test("should contain typeDefinition token", () => {
    expect(tokens).toContainEqual({
      type: "typeDefinition",
      value:
        "Define Types: word1, word2, word3 as Arrays; word4, word5 as Integer;",
    });
  });
    
    test("should contain descriptorDefinition token", () => {
        expect(tokens).toContainEqual({
        type: "descriptorDefinition",
        value: "Descriptors: My, Our, Their;",
        });
    });

    test("should contain assignerDefinition token", () => {
        expect(tokens).toContainEqual({
        type: "assignerDefinition",
        value: "Assigners: called, of;",
        });
    });

    test("should contain variableAssignment token", () => {
        expect(tokens).toContainEqual({
        type: "variableAssignment",
        value: "My house is a shell called my former self (1)",
        });
    });

    test("should contain comment token", () => {
        expect(tokens).toContainEqual({
        type: "comment",
        value: "# Define variables",
        });
    });

    test("should contain unknown token", () => {
        expect(tokens).toContainEqual({
        type: "unknown",
        value: "more variables",
        });
    });
  
    test("should contain prePrintingCommandsDefinition token", () => {
        expect(tokens).toContainEqual({
        type: "prePrintingCommandsDefinition",
        value: "Pre Printing Commands: Magic words, Secret code;",
        });
    });
  
    test("should contain printingCommandsDefinition token", () => {
        expect(tokens).toContainEqual({
        type: "printingCommandsDefinition",
        value: "Print Commands: reveal, speak;",
        });
    });
  
    test("should contain printStatement token", () => {
        expect(tokens).toContainEqual({
        type: "printStatement",
        value: "Magic words reveal ('A message to the world')",
        });
    });
});
