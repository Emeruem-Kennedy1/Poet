import SmartDataStructureParser from "../utils/smartDataStructureParser";

describe("SmartDataStructureParser", () => {
  let parser;

  beforeEach(() => {
    parser = new SmartDataStructureParser();
  });

  test("should parse a numeric value correctly", () => {
    const input = "42";
    const expected = 42;

    const result = parser.parse(input);

    expect(result).toBe(expected);
  });

  test("should parse an array correctly", () => {
    const input = "[1, 2, 3]";
    const expected = [1, 2, 3];

    const result = parser.parse(input);

    expect(result).toEqual(expected);
  });

  test("should parse a string correctly", () => {
    const input = '"Hello, World!"';
    const expected = "Hello, World!";

    const result = parser.parse(input);

    expect(result).toBe(expected);
  });

  test("should return the original input string if parsing fails", () => {
    const input = "invalid input";
    const expected = "invalid input";

    const result = parser.parse(input);

    expect(result).toBe(expected);
  });

  test("should parse a boolean value correctly", () => {
    const input = "true";
    const expected = true;

    const result = parser.parse(input);

    expect(result).toBe(expected);
  });
});
