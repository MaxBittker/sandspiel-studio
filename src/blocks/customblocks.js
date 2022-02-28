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
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks

import * as Blockly from "blockly/core";
import { elements } from "../Sand";
// Since we're using json to initialize the field, we'll need to import it.
import "../fields/BlocklyReactField";
import "../fields/DateField";

var testReactField = {
  type: "test_react_field",
  message0: "custom field %1",
  args0: [
    {
      type: "field_react_component",
      name: "FIELD",
      text: "Click me",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["test_react_field"] = {
  init: function () {
    this.jsonInit(testReactField);
    this.setStyle("loop_blocks");
  },
};

var reactDateField = {
  type: "test_react_date_field",
  message0: "date field %1",
  args0: [
    {
      type: "field_react_date",
      name: "DATE",
      date: "01/01/2020",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["test_react_date_field"] = {
  init: function () {
    this.jsonInit(reactDateField);
    this.setStyle("loop_blocks");
  },
};

Blockly.Blocks["element_dropdown"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("drop down:")
      .appendField(
        new Blockly.FieldDropdown(
          elements.map((name, i) => [name, i.toString()])
        ),
        "FIELDNAME"
      );
  },
};

Blockly.Blocks["sand_behavior_base"] = {
  init: function () {
    this.jsonInit({
      message0: "Behavior",
      message1: "%1",
      tooltip: "Behavior for the element",
      helpUrl: "",
      args1: [
        {
          type: "input_statement",
          name: "body",
          align: "CENTRE",
        },
      ],
      inputsInline: true,
    });
    this.setDeletable(false);
    this.setMovable(true);
    this.setStyle("loop_blocks");
  },
};

Blockly.Blocks["get_cell"] = {
  init: function () {
    this.jsonInit({
      type: "get_cell",
      message0: "get cell: %1 %2",
      args0: [
        {
          type: "input_value",
          name: "x",
          check: "Number",
        },
        {
          type: "input_value",
          name: "y",
          check: "Number",
        },
      ],
      inputsInline: true,
      output: "Number",
      colour: 230,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["set_cell"] = {
  init: function () {
    this.jsonInit({
      type: "set_cell",
      message0: "set cell%1 %2, %3",
      args0: [
        {
          type: "input_value",
          name: "x",
          check: "Number",
        },
        {
          type: "input_value",
          name: "y",
          check: "Number",
        },
        {
          type: "input_value",
          name: "cell",
          check: "Number",
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 270,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["swap_cells"] = {
  init: function () {
    this.jsonInit({
      type: "swap_cells",
      message0: "swap cells %1 %2",
      args0: [
        {
          type: "input_value",
          name: "x",
          check: "Number",
        },
        {
          type: "input_value",
          name: "y",
          check: "Number",
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 270,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Blocks['number_literal'] = {
  init: function() {
    this.jsonInit({
      type: "number_literal",
      output: "Number",
      message0: "%1",
      colour: 230,
      args0: [
        {
          type: "field_number",
          name: "VALUE",
          value: 0,
          precision: 1,
        }
      ],
    })
  },
};

//===================//
// SAND-BLOCKS DRAFT //
//===================//
Blockly.Blocks['number_literal'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldNumber(0, -Infinity, Infinity, 1), "VALUE");
    this.setOutput(true, "Number");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['element_literal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Air","0"], ["Water","1"], ["Sand","2"], ["Wall","3"], ["Plant","4"], ["Stone","5"], ["Cloner","6"], ["Fire","7"]]), "VALUE");
    this.setOutput(true, "Element");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['element_cell'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("element of");
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, "Element");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['change_into'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("change");
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.appendDummyInput()
        .appendField("into");
    this.appendValueInput("ELEMENT")
        .setCheck("Element");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['vector_literal'] = {
  init: function() {
    this.appendValueInput("X")
        .setCheck("Number");
    this.appendValueInput("Y")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['vector_constant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["➡ right","[1, 0]"], ["⬅ left","[-1, 0]"], ["⬆ up","[0, -1]"], ["⬇ down","[0, 1]"]]), "VALUE");
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['me'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("me");
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['vector_empty'] = {
  init: function() {
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['get_data_cell'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["⚡ energy","0"], ["⌛ age","1"], ["💥 pressure","2"], ["💫 density","3"], ["⭐ magic","4"]]), "DATA");
    this.appendDummyInput()
        .appendField("of");
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['set_data_cell'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["⚡ energy","0"], ["⌛ age","1"], ["💥 pressure","2"], ["💫 density","3"], ["⭐ magic","4"]]), "DATA");
    this.appendDummyInput()
        .appendField("of");
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.appendDummyInput()
        .appendField("to");
    this.appendValueInput("VALUE")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['get_vector_data_cell'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💨 wind of");
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['random_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("random number from");
    this.appendValueInput("MIN")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("to");
    this.appendValueInput("MAX")
        .setCheck("Number");
    this.setOutput(true, "Number");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
