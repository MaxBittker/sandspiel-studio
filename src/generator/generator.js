/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import * as Blockly from "blockly/core";
import "blockly/javascript";
import elements from "../elements";
//import a from "../starterblocks";

const getTypeOfCheck = (check) => {
  if (check === undefined) return "Any";
  if (check.length === 0) return "Void";
  if (check.length === 1) return check[0];
  if (check.length === 2) {
    throw new Error(
      "Block was more than one type! This shouldn't be allowed! Please tell @todepond that you saw this error :)"
    );
  }
  throw new TypeError(
    `Could not resolve block check into a Sand-Blocks type: ${check}`
  );
};

export const getTypeOfValue = (block, inputName) => {
  const input = block.getInput(inputName);
  const target = input.connection.targetConnection;
  if (target === null) return "Void";
  const check = target.check_;
  const type = getTypeOfCheck(check);
  return type;
};

Blockly.JavaScript["sand_behavior_base"] = function (block) {
  const lines = [];
  lines.push(`const swaps = [];`);

  let nextBlock = block.nextConnection.targetBlock();

  while (nextBlock !== null) {
    const code = Blockly.JavaScript.blockToCode(nextBlock);
    lines.push(code);
    nextBlock = nextBlock.nextConnection.targetBlock();
  }

  lines.push(`return swaps;`);

  /*try {
    lines.push(`const swaps = [];`);
    const body = Blockly.JavaScript.statementToCode(block, "body");
    lines.push(body);
    lines.push(`return swaps;`);
  } catch {
    // not sure why this error sometimes happens when you remove certain blocks
  }*/

  const code = lines.join("\n");
  return code;
};

Blockly.JavaScript["number_literal"] = function (block) {
  const number = block.getFieldValue("VALUE");
  const code = parseInt(number);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["element_literal"] = function (block) {
  const value = block.getFieldValue("VALUE");
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["group"] = function (block) {
  let code = "[";
  let i = 0;
  while (block.getInput(`ITEM${i}`) !== null) {
    const itemType = getTypeOfValue(block, `ITEM${i}`);
    const itemCode = Blockly.JavaScript.valueToCode(
      block,
      `ITEM${i}`,
      Blockly.JavaScript.ORDER_ATOMIC
    );
    code += `[${itemCode}, "${itemType}"],`;
    i++;
  }
  code += "]";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["vector_literal"] = function (block) {
  const x = Blockly.JavaScript.valueToCode(
    block,
    "X",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const y = Blockly.JavaScript.valueToCode(
    block,
    "Y",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `[${x}, ${y}]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["me"] = function (block) {
  const code = `[0, 0]`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
const DIRECTIONS = {
  HERE: "[0, 0]",
  DOWN: "[0, 1]",
  LEFT: "[-1, 0]",
  RIGHT: "[1, 0]",
  UP: "[0, -1]",
  NW: "[-1, -1]",
  NE: "[1, -1]",
  SW: "[-1, 1]",
  SE: "[1, 1]",
  RAND: "this.randomOffset()",
};

Blockly.JavaScript["vector_constant"] = function (block) {
  const directionName = block.getFieldValue("VALUE");
  const code = `${DIRECTIONS[directionName]}`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["print"] = function (block) {
  const message = Blockly.JavaScript.valueToCode(
    block,
    "MESSAGE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `console.log(${message})`;
  return code;
};

Blockly.JavaScript["string_literal"] = function (block) {
  const string = block.getFieldValue("VALUE");
  const code = "`" + string + "`";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["change_into"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const element = Blockly.JavaScript.valueToCode(
    block,
    "ELEMENT",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `this.setSandRelative(${cell}, ${element});\n`;
  return code;
};

Blockly.JavaScript["set_r_cell"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const valueCode = `this.clamp(${value}, -100, 100) + 100`;
  if (field === "ELEMENT") {
    return `this.setSandRelative(${cell}, ${value})`;
  } else if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  }
};

Blockly.JavaScript["set_r_cell_short"] = function (block) {
  const cell = "[0, 0]";
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const valueCode = `this.clamp(${value}, -100, 100) + 100`;
  if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  }
};

Blockly.JavaScript["modify_r"] = function (block) {
  const cell = "[0, 0]";
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const offset = field === "RA" ? "1" : "2";
  const valueCode = `this.clamp(this.getSandRelative(${cell}, ${offset}) - 100 + ${value}, -100, 100) + 100`;
  if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  }
};

Blockly.JavaScript["get_r_cell"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const field = block.getFieldValue("DATA");
  if (field === "ELEMENT") {
    return [
      `this.getSandRelative(${cell}, 0)`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RA") {
    return [
      `this.getSandRelative(${cell}, 1) - 100`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RB") {
    return [
      `this.getSandRelative(${cell}, 2) - 100`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  }
};

Blockly.JavaScript["get_r_cell_short"] = function (block) {
  const cell = "[0, 0]";
  const field = block.getFieldValue("DATA");
  if (field === "RA") {
    return [
      `this.getSandRelative(${cell}, 1) - 100`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RB") {
    return [
      `this.getSandRelative(${cell}, 2) - 100`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  }
};

Blockly.JavaScript["element_cell"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const code = `this.getSandRelative(${cell})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["swap"] = function (block) {
  const a = Blockly.JavaScript.valueToCode(
    block,
    "A",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const b = Blockly.JavaScript.valueToCode(
    block,
    "B",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const code = `this.swapSandRelative(${a}, ${b}, swaps);\n`;
  return code;
};

Blockly.JavaScript["move"] = function (block) {
  const direction = Blockly.JavaScript.valueToCode(
    block,
    "DIRECTION",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const code = `this.swapSandRelative([0, 0], ${direction}, swaps);\nthis.moveOrigin(${direction});\n`;
  return code;
};

Blockly.JavaScript["random_number"] = function (block) {
  const min = Blockly.JavaScript.valueToCode(
    block,
    "MIN",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const max = Blockly.JavaScript.valueToCode(
    block,
    "MAX",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const range = max - min + 1;
  const code = `(${min} + Math.floor(Math.random() * ${range}))`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["one_in"] = function (block) {
  const n = Blockly.JavaScript.valueToCode(
    block,
    "NUMBER",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `(Math.random() < 1/${n})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["bool_literal"] = function (block) {
  const boolName = block.getFieldValue("VALUE");
  const code = boolName === "TRUE" ? "true" : "false";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["statement_value"] = function (block) {
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return `this.returnValue = ${value};\n`;
};

Blockly.JavaScript["statement_value_shadow"] = function (block) {
  return ["undefined", Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["not"] = function (block) {
  const bool = Blockly.JavaScript.valueToCode(
    block,
    "BOOL",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `!${bool}`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["if"] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(
    block,
    "CONDITION",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const then = Blockly.JavaScript.statementToCode(block, "THEN");
  const code = `if (${condition}) {\n${then}\n}`;
  return code;
};

Blockly.JavaScript["repeat"] = function (block) {
  const n = Blockly.JavaScript.valueToCode(
    block,
    "NUMBER",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const statement = Blockly.JavaScript.statementToCode(block, "STATEMENT");
  const code = `for (let i = 0; i < ${n}; i++) {\n${statement}\n}`;
  return code;
};

Blockly.JavaScript["in_a_random"] = function (block) {
  const name = block.getFieldValue("NAME");
  const statement = Blockly.JavaScript.statementToCode(block, "NAME");
  const code = `{const oldTransformation = this.getTransformation();\n this.setRandomTransformation("${name}");\n${statement}this.setTransformation(...oldTransformation);}\n`;
  return code;
};

Blockly.JavaScript["for_all"] = function (block) {
  const name = block.getFieldValue("NAME");
  const statement = Blockly.JavaScript.statementToCode(block, "NAME");
  const lines = [];
  lines.push(`{`);
  lines.push(`  const oldTransformation = this.getTransformation();`);
  lines.push(
    `  this.loopThroughTransformation("${name}", () => {${statement}});`
  );
  lines.push(`  this.setTransformation(...oldTransformation);`);
  lines.push(`}`);
  const code = lines.join("\n");
  return code;
};

Blockly.JavaScript["if_else"] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(
    block,
    "CONDITION",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const then = Blockly.JavaScript.statementToCode(block, "THEN");
  const else_ = Blockly.JavaScript.statementToCode(block, "ELSE");
  const code = `if (${condition}) {\n${then}\n} else {\n${else_}\n}`;
  return code;
};

const COMPARISON_FUNCTIONS = {
  IS: "eq",
  BIGGER: "greaterThan",
  SMALLER: "lessThan",
};

Blockly.JavaScript["comparison"] = function (block) {
  const aType = getTypeOfValue(block, "A");
  const bType = getTypeOfValue(block, "B");

  let a = Blockly.JavaScript.valueToCode(
    block,
    "A",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let b = Blockly.JavaScript.valueToCode(
    block,
    "B",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  if (a === "") a = "undefined";
  if (b === "") b = "undefined";

  const comparison = block.getFieldValue("COMPARISON");
  const functionName = COMPARISON_FUNCTIONS[comparison];

  const code = `this.${functionName}(${a}, ${b}, "${aType}", "${bType}")`;

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

const OPERATION_FUNCTIONS = {
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  DIVIDE: "divide",
};

Blockly.JavaScript["operation"] = function (block) {
  const aType = getTypeOfValue(block, "A");
  const bType = getTypeOfValue(block, "B");

  let a = Blockly.JavaScript.valueToCode(
    block,
    "A",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let b = Blockly.JavaScript.valueToCode(
    block,
    "B",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  if (a === "") a = "undefined";
  if (b === "") b = "undefined";

  const operation = block.getFieldValue("OPERATION");
  const functionName = OPERATION_FUNCTIONS[operation];

  const code = `this.${functionName}(${a}, ${b}, "${aType}", "${bType}")`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

const BOOLEAN_OPERATORS = {
  AND: "&&",
  OR: "||",
};

Blockly.JavaScript["boolean_operation"] = function (block) {
  let a = Blockly.JavaScript.valueToCode(
    block,
    "A",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let b = Blockly.JavaScript.valueToCode(
    block,
    "B",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  if (a === "") a = "false";
  if (b === "") b = "false";

  let operatorName = block.getFieldValue("OPERATION");
  const operator = BOOLEAN_OPERATORS[operatorName];

  const code = `${a} ${operator} ${b}`;

  return [code, Blockly.JavaScript.ORDER_LOGICAL_AND];
};

Blockly.JavaScript["is_block"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  const element = Blockly.JavaScript.valueToCode(
    block,
    "ELEMENT",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const type = getTypeOfValue(block, "ELEMENT");
  const code = `this.isBlock(${cell}, ${element}, "${type}")`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["is_touching"] = function (block) {
  /*const cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );*/
  const element = Blockly.JavaScript.valueToCode(
    block,
    "ELEMENT",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const type = getTypeOfValue(block, "ELEMENT");
  const code = `this.isTouching([0, 0], ${element}, "${type}")`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["key_pressed"] = function (block) {
  let key = block.getFieldValue("KEY");
  const code = `this.keys["${key}"]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["get_r_cell_flexible"] = function (block) {
  let cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  if (cell === "") cell = "[0, 0]";

  const field = block.getFieldValue("DATA");
  if (field === "ELEMENT") {
    return [
      `this.getSandRelative(${cell}, 0)`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RA") {
    return [
      `this.getSandRelative(${cell}, 1) - 100`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RB") {
    return [
      `this.getSandRelative(${cell}, 2) - 100`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  }
};

Blockly.JavaScript["set_r_cell_flexible"] = function (block) {
  let cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  if (cell === "") cell = "[0, 0]";
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const valueCode = `this.clamp(${value}, -100, 100) + 100`;
  if (field === "ELEMENT") {
    return `this.setSandRelative(${cell}, ${value})`;
  } else if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  }
};

Blockly.JavaScript["modify_r_cell_flexible"] = function (block) {
  let cell = Blockly.JavaScript.valueToCode(
    block,
    "CELL",
    Blockly.JavaScript.ORDER_MEMBER
  );
  if (cell === "") cell = "[0, 0]";
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const offset = field === "RA" ? "1" : "2";
  const valueCode = `this.clamp(this.getSandRelative(${cell}, ${offset}) - 100 + ${value}, -100, 100) + 100`;
  if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  }
};
