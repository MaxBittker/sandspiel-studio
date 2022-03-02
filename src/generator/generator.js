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

Blockly.JavaScript["sand_behavior_base"] = function (block) {
  const body = Blockly.JavaScript.statementToCode(block, "body");
  return body;
};

Blockly.JavaScript["number_literal"] = function (block) {
  const number = block.getFieldValue("VALUE");
  return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

const ELEMENTS = {
  AIR: 0,
  WATER: 1,
  SAND: 2,
  WALL: 3,
  PLANT: 4,
  STONE: 5,
  CLONER: 6,
  FIRE: 7,
};

Blockly.JavaScript["element_literal"] = function (block) {
  const elementName = block.getFieldValue("VALUE");
  const element = ELEMENTS[elementName];
  return [element, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript["vector_literal"] = function (block) {
  const x = Blockly.JavaScript.valueToCode(block, "X", Blockly.JavaScript.ORDER_ATOMIC);
  const y = Blockly.JavaScript.valueToCode(block, "Y", Blockly.JavaScript.ORDER_ATOMIC);
  const code = `[${x}, ${y}]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

Blockly.JavaScript["me"] = function (block) {
  const code = `[0, 0]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

const DIRECTIONS = {
  DOWN: "[0, 1]",
  LEFT: "[-1, 0]",
  RIGHT: "[1, 0]",
  UP: "[0, -1]",
};

Blockly.JavaScript["vector_constant"] = function (block) {
  const directionName = block.getFieldValue("VALUE");
  const code = DIRECTIONS[directionName];
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

Blockly.JavaScript["print"] = function (block) {
  const message = Blockly.JavaScript.valueToCode(block, "MESSAGE", Blockly.JavaScript.ORDER_ATOMIC);
  const code = `console.log(${message})`;
  return code;
}

Blockly.JavaScript["string_literal"] = function (block) {
  const string = block.getFieldValue("VALUE");
  const code = "`" + string + "`";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["change_into"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(block, "CELL", Blockly.JavaScript.ORDER_MEMBER);
  const element = Blockly.JavaScript.valueToCode(block, "ELEMENT", Blockly.JavaScript.ORDER_ATOMIC);
  console.log(element)
  const code = `window.setSandRelative(...${cell}, ${element})`;
  return code;
}

Blockly.JavaScript["element_cell"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(block, "CELL", Blockly.JavaScript.ORDER_MEMBER);
  const code = `window.getSandRelative(...${cell})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}