/**
 * A class that parses smart data structures.
 */
class SmartDataStructureParser {
  parse(inputString) {
    // Handling a numeric value
    if (!isNaN(inputString)) {
      return Number(inputString);
    }

    // Handling an array or string
    try {
      let parsed = JSON.parse(inputString);

      // JSON.parse successfully parsed a number, so return the original input as a string
      if (typeof parsed === "number") {
        return inputString;
      }

      return parsed;
    } catch (e) {
      // If parsing fails, it's likely a regular string, return it as is
      return inputString;
    }
  }
}

export default SmartDataStructureParser;