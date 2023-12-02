# Poet Programming Language
This is a programming language that allows users to write code in a poetic way. It is a work in progress.

## Table of Contents
- [Introduction](#introduction)
- [Setup](#setup)
- [Variable Assignment Structure](#variable-assignment-structure)
- [Printing to the Console](#printing-to-the-console)
- [How to Run a `.maya` Script](#how-to-run-a-maya-script)


## Setup
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
- **Syntax**: `Define Types: word1, word2 as [variable type]; word3 as [variable type];`
- **Functionality**: Users define custom keywords to represent standard data types.
- **valid types**: `string`, `number`, `boolean`, `array`. These are the only valid types for now. More will be added as the language evolves.

#### Descriptors
- **Syntax**: `Descriptor: word1, word2, word3`
- **Functionality**: Users define descriptors to add a personal or contextual touch to variable declarations.

#### Assigners
- **Syntax**: `Assigner: word1, word2, word3`
- **Functionality**: Users define assigners to introduce the value assignment in a poetic way.

## Variable Assignment Structure
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


## Printing to the Console

In our language, you have the flexibility to print both variable values and direct values (such as strings or numbers) to the console. This is achieved using a unique syntax that combines a pre-defined pre-printing command, a print command, and the content to be printed (either a variable or a direct value).

### Syntax

The general syntax for printing to the console is as follows:

```
[pre-printing command] [print command] [variable]
```

or

```
[pre-printing command] [print command] (value)
```

### Defining Pre-Printing and Print Commands

First, define a pre-printing command in the setup block of your script. This command is a custom keyword that will precede all print statements.

Example:

```plaintext
--start setup
Pre Printing Commands: Magic words, Secret code
Print Commands: reveal, speak
--end setup
```

### Printing a Variable

To print the value of a variable, use the pre-printing command followed by your chosen print command and the variable name.

Example:

```plaintext
Magic words reveal house
```

This command will print the value of the variable `house` to the console.

### Printing a Direct Value

To print a direct value such as a string or a number, enclose the value in parentheses and precede it with the pre-printing command and print command.

Example:

```plaintext
Magic words reveal ('hello world')
```

This command will print `hello world` to the console.

### Notes

- Ensure that the pre-printing and print commands are defined in the setup block of your script.
- The print command can be any keyword of your choice and should be used consistently throughout your script.
- Direct values need to be enclosed in parentheses when printing.
- Be cautious with variable names and ensure they are defined before attempting to print them.

### Example Usage

```plaintext
--start setup
Assigner: called
Descriptor: My
Type: shell, pooch as Array
Pre Printing Commands: Magic words, Secret code
Print Commands: reveal, speak
--end setup

My house is a shell called my former self ([1, 2, 3])

# prints [1, 2, 3] to the console
Magic words reveal house

# prints 'hello world' to the console
Magic words reveal ('A message to the world')
```

In this example, the script will print the value of `house` which is `[1, 2, 3]` to the console. It will also print `A message to the world` to the console.

## How to Run a `.maya` Script
### Prerequisites

Before running `poet`, ensure you have the following installed:
- Node.js (Download and install from [Node.js official website](https://nodejs.org/))

### Installation

1. **Clone the Repository** (if you haven't already):
   ```
   git clone https://github.com/Emeruem-Kennedy1/Poet.git
   cd Poet
   ```

2. **Install Dependencies**:
   Navigate to the project directory and run:
   ```
   npm install
   ```
3. **Link the Package**:
   To run `poet` from anywhere on your system, you need to link the package.
   Run the following command in the project directory:
   ```
   npm link
   ```
   This will create a symlink from the executable to the system path.

### Running `poet`

To run a `.maya` script using `poet`, use the following command in your terminal:

```
poet -r path/to/your/script.maya
```

or

```
poet read path/to/your/script.maya
```

Replace `path/to/your/script.maya` with the actual path to your `.maya` file.

### Example

Suppose you have a script named `example.maya`. To run this script, navigate to the directory containing `poet` and run:

```
poet -r example.maya
```

This will execute the script and display any output in the terminal.

### Troubleshooting

- Ensure the file path is correct and that the file ends with the `.maya` extension.
- If you encounter any permission issues with the poet command, you might need to run `npm link` again or check your Node.js installation.
- For any syntax errors or issues within the script, this is a work in progress. I will update this section as the language evolves.
- If you encounter any other issues, please create an issue on this repository.