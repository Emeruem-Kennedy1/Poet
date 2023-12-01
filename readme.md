# Poet Programming Language
This is a programming language that allows users to write code in a poetic way. It is a work in progress.

### Setup
- **Syntax**: `Setup:`
- **Functionality**: Users define the initial setup of the program. This includes:
  - Types
  - Descriptors
  - Assigners

- **Usage:** You wrap the setup code in a block like this:
  ```
  --start setup

  --end setup
  ```

You can add the following to the setup:

#### Type Creation
- **Syntax**: `Define Types: word1, word2, word3 as Arrays; word4, word5 as Integer;`
- **Functionality**: Users define custom keywords to represent standard data types.

#### Descriptors
- **Syntax**: `Descriptor: My, Our, Their;`
- **Functionality**: Users define descriptors to add a personal or contextual touch to variable declarations.

#### Assigners
- **Syntax**: `Assigner: called, of;`
- **Functionality**: Users define assigners to introduce the value assignment in a poetic way.

### Variable Assignment Structure
- **Format**: `[descriptor] [variable] is a [type] [assigner] [poetic completer] (value)`
- **Components**:
  - `[descriptor]`: User-defined, adds a unique touch.
  - `[variable]`: Name of the variable.
  - `[type]`: Data type as defined in the setup.
  - `[poetic completer]`: Artistic phrase completing the statement.
  - [assigner]: User-defined, to show the assignment of a value.
  - `(value)`: Actual value in parentheses for clarity.
- **Examples**: 
  - `"My house is a shell called my former self (1)"`
    - `My`: Descriptor, as defined in setup.
    - `house`: Variable name.
    - `shell`: Data type as seen in the initial setup.
    - `called`: Assigner, as defined in setup.
    - `my former self`: Poetic completer, enhancing the statement artistically.
    - `(1)`: The actual value being assigned to `house`.
    This corresponds to the following in a standard programming language:
    **Python**:
      ```python
      house = 1
      ```
      **C++**:
      ```cpp
      int house = 1;
      ```
      **TypeScript**:
      ```typescript
      let house: number = 1;
      ```

  - `Your Dog is a pooch of the canine variety ([1, 2, 3])`
    - `Your`: Descriptor, as defined in setup.
    - `Dog`: Variable name.
    - `pooch`: Data type as seen in the initial setup.
    - `of`: Assigner, as defined in setup.
    - `the canine variety`: Poetic completer, enhancing the statement artistically.
    - `([1, 2, 3])`: The actual value being assigned to `Dog`.
    This corresponds to the following in a standard programming language:

    **Python**:
      ```python
      Dog = [1, 2, 3]
      ```
      **C++**:
      ```cpp
      int Dog[3] = {1, 2, 3};
      ```
      **TypeScript**:
      ```typescript
      let Dog: number[] = [1, 2, 3];
      ```

**Notes**:
- Ensure that you define the types, descriptors, and assigners in the setup before using them in the variable assignment structure. Otherwise, the program will throw an error.
- The variable assignment structure is a work in progress. It will be updated as the language evolves.