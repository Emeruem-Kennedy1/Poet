#!/usr/bin/env node

import fs from "fs";
import Lexer from "./tools/lexer.js";
import Parser from "./tools/parser.js";
import Interpreter from "./tools/interpreter.js";

function run(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return;
    }

    const lexer = new Lexer(data);
    const tokens = lexer.lex();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter(ast);

    interpreter.interpret();
  });
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length >= 2 && args[0] === "-r") {
  const filePath = args[1];
  run(filePath);
} else {
  console.log("Usage: poet -r [file path]");
}
