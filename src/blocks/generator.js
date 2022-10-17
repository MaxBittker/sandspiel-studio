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

import tinycolor2 from "tinycolor2";
import * as Blockly from "blockly/core";
import { Xml } from "blockly/core";
import BlocklyJS from "blockly/javascript";
import useStore, { globalState } from "../store";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import "blockly/javascript";

const approvedCheckTypes = new Set([
  "Any",
  "Void",
  "Number",
  "Vector",
  "Boolean",
  "Element",
  "Group",
  "String",
]);

const getTypeOfCheck = (check) => {
  if (check === undefined) return "Any";
  if (check.length === 0) return "Void";
  if (check.length === 1) {
    // Probably not needed, but let's check it's an approved type anyway
    if (!approvedCheckTypes.has(check[0])) {
      throw new TypeError(`Could not resolve unapproved type: ${check[0]}`);
    }
    return check[0];
  }
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
  return `const swaps = [];`;
};

// Field received from user - parseInt
Blockly.JavaScript["number_literal"] = function (block) {
  const number = block.getFieldValue("VALUE");
  const code = parseInt(number);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["number_literal_positive"] =
  Blockly.JavaScript["number_literal"];

// Field received from user - parseInt
Blockly.JavaScript["element_literal"] = function (block) {
  const value = block.getFieldValue("VALUE");
  const code = parseInt(value);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
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
  KB: "this.getKeyBoardVector()",
};

const approvedDirectionNames = new Set(Object.keys(DIRECTIONS));

// Field received from user - checked against approved list
Blockly.JavaScript["vector_constant"] = function (block) {
  const directionName = block.getFieldValue("VALUE");
  if (!approvedDirectionNames.has(directionName)) {
    throw new TypeError(`Unapproved direction name: '${directionName}'`);
  }
  const code = `${DIRECTIONS[directionName]}`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

// Blockly.JavaScript["print"] = function (block) {
//   const message = Blockly.JavaScript.valueToCode(
//     block,
//     "MESSAGE",
//     Blockly.JavaScript.ORDER_ATOMIC
//   );
//   const code = `console.log(${message})`;
//   return code;
// };

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
Blockly.JavaScript["cursor_distance"] = function (block) {
  return [`this.getCursorDistance()`, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript["keyboard_vector"] = function (block) {
  return [`this.getKeyBoardVector()`, Blockly.JavaScript.ORDER_ATOMIC];
};

// Field received from user - not used in code
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
  const valueCode = `this.clamp(${value},0, 100) `;
  if (field === "ELEMENT") {
    return `this.setSandRelative(${cell}, ${value}, 0, 0, 0)`;
  } else if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  } else if (field === "RC") {
    return `this.setSandRelative(${cell}, undefined, undefined, undefined, ${valueCode});\n`;
  }
};

// Field received from user - not used in code
Blockly.JavaScript["set_r_cell_short"] = function (block) {
  const cell = "[0, 0]";
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const valueCode = `this.clamp(${value}, 0, 100)`;
  if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  } else if (field === "RC") {
    return `this.setSandRelative(${cell}, undefined, undefined, undefined, ${valueCode});\n`;
  }
};

function getOffset(field) {
  if (field == "RA") return 1;
  if (field == "RB") return 2;
  if (field == "RC") return 3;
}

// Field received from user - not used in code
Blockly.JavaScript["modify_r"] = function (block) {
  const cell = "[0, 0]";
  const value = Blockly.JavaScript.valueToCode(
    block,
    "VALUE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const field = block.getFieldValue("DATA");
  const offset = getOffset(field);
  const valueCode = `this.clamp(this.getSandRelative(${cell}, ${offset}) +  ${value}, 0, 100)`;
  if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  } else if (field === "RC") {
    return `this.setSandRelative(${cell}, undefined, undefined, undefined, ${valueCode});\n`;
  }
};

// Field received from user - not used in code
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
      `this.getSandRelative(${cell}, 1)`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RB") {
    return [
      `this.getSandRelative(${cell}, 2)`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RC") {
    return [
      `this.getSandRelative(${cell}, 3)`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  }
};

// Field received from user - not used in code
Blockly.JavaScript["get_r_cell_short"] = function (block) {
  const cell = "[0, 0]";
  const field = block.getFieldValue("DATA");
  if (field === "RA") {
    return [
      `this.getSandRelative(${cell}, 1) `,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RB") {
    return [
      `this.getSandRelative(${cell}, 2) `,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RC") {
    return [
      `this.getSandRelative(${cell}, 3)`,
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

Blockly.JavaScript["clone"] = function (block) {
  const direction = Blockly.JavaScript.valueToCode(
    block,
    "DIRECTION",
    Blockly.JavaScript.ORDER_MEMBER
  );

  const code = `this.cloneSandRelative([0, 0], ${direction});\n`;
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
  const range = `(${max} - ${min} + 1)`;
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

// Field received from user - not used in code
Blockly.JavaScript["bool_literal"] = function (block) {
  const boolName = block.getFieldValue("VALUE");
  const code = boolName === "TRUE" ? "true" : "false";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["true_literal"] = function (block) {
  return ["true", Blockly.JavaScript.ORDER_MEMBER];
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
  const lines = [];

  let condition = Blockly.JavaScript.valueToCode(
    block,
    "CONDITION",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  if (condition === "") {
    condition = "false";
  }
  const then = Blockly.JavaScript.statementToCode(block, "THEN");
  lines.push(`if (${condition}) {\n${then}\n}`);

  for (const elseId of block.elseIds) {
    const elseCondition = Blockly.JavaScript.valueToCode(
      block,
      `ELSE_CONDITION${elseId}`,
      Blockly.JavaScript.ORDER_ATOMIC
    );

    const elseThen = Blockly.JavaScript.statementToCode(block, `THEN${elseId}`);
    lines.push(`else if (${elseCondition}) {\n${elseThen}\n}`);
  }

  const code = lines.join("\n");
  return code;
};

Blockly.JavaScript["repeat"] = function (block) {
  const n = Blockly.JavaScript.valueToCode(
    block,
    "NUMBER",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const statement = Blockly.JavaScript.statementToCode(block, "STATEMENT");
  const code = `for (let i = 0; i < Math.round(${n}); i++) {\n${statement}\n}`;
  return code;
};

Blockly.JavaScript["every_n_frames"] = function (block) {
  const n = Blockly.JavaScript.valueToCode(
    block,
    "NUMBER",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const statement = Blockly.JavaScript.statementToCode(block, "STATEMENT");
  const code = `if (this.t % ${n} === 0) {\n${statement}\n}`;
  return code;
};

Blockly.JavaScript["rotated_by"] = function (block) {
  const n = Blockly.JavaScript.valueToCode(
    block,
    "NUMBER",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  const statement = Blockly.JavaScript.statementToCode(block, "BODY");
  const code = `{const oldTransformation = this.getTransformation();\n this.setRotation(Math.round(${n}));\n${statement}this.setTransformation(...oldTransformation);}\n`;
  return code;
};

const approvedTransformationNames = new Set([
  "ROTATION",
  "REFLECTION",
  "HORIZONTAL_REFLECTION",
  "VERTICAL_REFLECTION",
]);

// Field received from user - checked against approved list
Blockly.JavaScript["in_a_random"] = function (block) {
  const name = block.getFieldValue("NAME");
  if (!approvedTransformationNames.has(name)) {
    throw new TypeError(`Unapproved transformation name: '${name}'`);
  }
  const statement = Blockly.JavaScript.statementToCode(block, "NAME");
  const code = `{const oldTransformation = this.getTransformation();\n this.setRandomTransformation("${name}");\n${statement}this.setTransformation(...oldTransformation);}\n`;
  return code;
};

// Field received from user - checked against approved list
Blockly.JavaScript["for_all"] = function (block) {
  const name = block.getFieldValue("NAME");
  if (!approvedTransformationNames.has(name)) {
    throw new TypeError(`Unapproved transformation name: '${name}'`);
  }
  const statement = Blockly.JavaScript.statementToCode(block, "NAME");
  const lines = [];
  lines.push(`{`);
  lines.push(`  const oldTransformation = this.getTransformation();`);
  lines.push(
    `  this.loopThroughTransformation("${name}", () => {
    ${statement}
    });`
  );
  lines.push(`  this.setTransformation(...oldTransformation);`);
  lines.push(`}`);
  const code = lines.join("\n");
  return code;
};

const COMPARISON_FUNCTIONS = {
  IS: "eq",
  BIGGER: "greaterThan",
  SMALLER: "lessThan",
};

// Field received from user - not used in code
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
  MOD: "mod",
  DIFFERENCE: "difference",
};

// Field received from user - not used in code
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

// Field received from user - not used in code
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

Blockly.JavaScript["number_touching"] = function (block) {
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
  const code = `this.getNumberTouching([0, 0], ${element}, "${type}")`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

const approvedKeyNames = new Set([
  "SPACE",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
]);

// Field received from user - checked against approved list
Blockly.JavaScript["key_pressed"] = function (block) {
  let key = block.getFieldValue("KEY");
  if (!approvedKeyNames.has(key)) {
    throw new TypeError(`Unapproved key name: '${key}'`);
  }
  if (key === "SPACE") key = " "; //Fix for serialization bug - blockly didn't like a whitespace value
  const code = `this.keys["${key}"]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

// Field received from user - not used in code
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
      `this.getSandRelative(${cell}, 1) `,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RB") {
    return [
      `this.getSandRelative(${cell}, 2) `,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  } else if (field === "RC") {
    return [
      `this.getSandRelative(${cell}, 3) `,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  }
};

// Field received from user - not used in code
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
  const valueCode = `this.clamp(${value}, 0, 100)`;
  if (field === "ELEMENT") {
    return `this.setSandRelative(${cell}, ${value}, undefined, undefined, undefined, false);\n`;
  } else if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  } else if (field === "RC") {
    return `this.setSandRelative(${cell}, undefined, undefined, undefined, ${valueCode});\n`;
  }
};

// Field received from user - not used in code
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
  const offset = getOffset(field);
  const valueCode = `this.clamp(this.getSandRelative(${cell}, ${offset})  + ${value}, 0, 100) `;

  if (field === "ELEMENT") {
    return `this.setSandRelative(${cell}, this.getSandRelative(${cell}, ${offset})  + ${value});\n`;
  } else if (field === "RA") {
    return `this.setSandRelative(${cell}, undefined, ${valueCode});\n`;
  } else if (field === "RB") {
    return `this.setSandRelative(${cell}, undefined, undefined, ${valueCode});\n`;
  } else if (field === "RC") {
    return `this.setSandRelative(${cell}, undefined, undefined, undefined, ${valueCode});\n`;
  }
};

// Field received from user - not used in code
Blockly.JavaScript["comment"] = function (block) {
  //const comment = (block.getFieldValue("DATA") ?? "").replace("\n", " ");
  return ``;
};

Blockly.JavaScript["after"] = function (block) {
  const statement = Blockly.JavaScript.statementToCode(block, "STATEMENT");
  const code = `this.callAfterFrame(() => {\n${statement}\n});`;
  return code;
};

// Field received from user - not used in code
export function deriveColor(xmlString, b = "") {
  let pattern = `<field name="COLOR${b}">`;
  let pl = pattern.length;
  let location = xmlString.indexOf(pattern);
  let colorString = xmlString.slice(location + pl, location + pl + 7);
  let color = tinycolor2(colorString).toHsl();
  return [color.h / 360, color.s, color.l];
}

// Field received from user - not used in code
export function deriveName(xmlString) {
  const r = /<field name="ELEMENT_NAME">(.*?)<\/field>/;
  const match = r.exec(xmlString);
  if (!match) {
    return "?";
  }
  return match[1];
}

export function generateCode(element, ws) {
  let baseBlock = undefined;
  for (let i = 0; i < ws.topBlocks_.length; i++) {
    const block = ws.topBlocks_[i];
    if (block.type == "sand_behavior_base") {
      baseBlock = block;
      break;
    }
  }
  try {
    let code = BlocklyJS.blockToCode(baseBlock);

    code = prettier.format(code, {
      parser: "babel",
      plugins: [parserBabel],
    });
    // console.log(element + "\n" + code);
    let xml = Xml.workspaceToDom(ws);
    let xmlText = Xml.domToPrettyText(xml);
    // eslint-disable-next-line no-new-func
    let fn = Function(code);
    useStore.getState().setXml(xmlText, element);
    globalState.updaters[element] = fn.bind(globalState);
  } catch (e) {
    console.error(e);
    return;
  }
}
