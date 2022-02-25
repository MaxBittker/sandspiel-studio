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

Blockly.JavaScript["test_react_field"] = function (block) {
  return "console.log('custom block');\n";
};

Blockly.JavaScript["test_react_date_field"] = function (block) {
  return "console.log(" + block.getField("DATE").getText() + ");\n";
};

Blockly.JavaScript["get_cell"] = function (block) {
  var value_x = Blockly.JavaScript.valueToCode(
    block,
    "x",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_y = Blockly.JavaScript.valueToCode(
    block,
    "y",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `window.getSandRelative(${value_x}, ${value_y})`;

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["set_cell"] = function (block) {
  var value_x = Blockly.JavaScript.valueToCode(
    block,
    "x",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_y = Blockly.JavaScript.valueToCode(
    block,
    "y",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_cell = Blockly.JavaScript.valueToCode(
    block,
    "cell",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `window.setSandRelative(${value_x}, ${value_y}, ${value_cell});
  `;

  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};

Blockly.JavaScript["swap_cells"] = function (block) {
  var value_x = Blockly.JavaScript.valueToCode(
    block,
    "x",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_y = Blockly.JavaScript.valueToCode(
    block,
    "y",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = `window.swapSandRelative(${value_x}, ${value_y});
    `;

  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};

Blockly.JavaScript["sand_behavior_base"] = function (block) {
  var color = block.getFieldValue("Color");
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  //console.log(color, value_name);

  var body = Blockly.JavaScript.statementToCode(
    block,
    "body",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  //console.log(body);
  let code = `
this.color = "${color}";
${body}`;
  return code;
};

Blockly.JavaScript["number_literal"] = function (block) {
  const value = block.getFieldValue("VALUE");
  console.log(value)
  return value.toString()
}