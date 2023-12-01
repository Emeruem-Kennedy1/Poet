import { readFileSync } from "fs";
import lexer from "./lexer";
// Parser: Convert tokens into an AST
function parser(tokens) {
  // Parse tokens and create an AST
}

// Interpreter: Execute the AST
function interpreter(ast) {
  // Interpret the AST
}

// TODO: remebmer that file extensions are .maya
// Read Poet script from a file
const script = readFileSync("path/to/poet/script.txt", "utf-8");

// Lexer -> Parser -> Interpreter
const tokens = lexer(script);
const ast = parser(tokens);

// TODO: Implement the interpreter
interpreter(ast);
