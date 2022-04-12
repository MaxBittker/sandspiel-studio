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
//import { elements } from "../Sand";
// Since we're using json to initialize the field, we'll need to import it.
import "../fields/BlocklyReactField";
import "../fields/DateField";
import { getTypeOfValue } from "../generator/generator.js";

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
    this.setColour(160);
    //this.setStyle("loop_blocks");
  },
};

//===================//
// SAND-BLOCKS DRAFT //
//===================//
Blockly.Blocks["number_literal"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(new Blockly.FieldNumber(0, -100, 100, 1), "VALUE");
    this.setOutput(true, "Number");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["element_literal"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Air", "AIR"],
        ["Water", "WATER"],
        ["Sand", "SAND"],
        ["Wall", "WALL"],
        ["Plant", "PLANT"],
        ["Stone", "STONE"],
        ["Cloner", "CLONER"],
        ["Fire", "FIRE"],
        ["Ice", "ICE"],
        ["Gas", "GAS"],
        ["Wood", "WOOD"],
        ["Lava", "LAVA"],
        ["Acid", "ACID"],
        ["Dust", "DUST"],
      ]),
      "VALUE"
    );
    this.setOutput(true, "Element");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["element_cell"] = {
  init: function () {
    this.appendDummyInput().appendField("element of");
    this.appendValueInput("CELL").setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, "Element");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "if",
    message0: "if %1 %2 then %3 %4",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "CONDITION",
        check: "Boolean",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "THEN",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 330,
    tooltip: "",
    helpUrl: "",
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "group",
    message0: "%1 or %2 %3",
    args0: [
      {
        type: "input_value",
        name: "ITEM0",
        check: "Element",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "ITEM1",
        check: "Element",
      },
    ],
    inputsInline: true,
    output: "Group",
    colour: 160,
    tooltip: "",
    helpUrl: "",
    mutator: "group_mutator",
  },
]);

Blockly.Extensions.registerMutator(
  "group_mutator",
  {
    mutationToDom() {
      var container = Blockly.utils.xml.createElement("mutation");
      container.setAttribute("itemCount", this.itemCount);
      return container;
    },
    domToMutation(mutation) {
      const block = this;
      block.itemCount = parseInt(mutation.getAttribute("itemCount"));
      if (isNaN(block.itemCount)) {
        block.itemCount = 2;
      }

      block.rebuild();
    },
    rebuild() {
      const block = this;

      block.removeInput("PLUS", true);
      block.removeInput("MINUS", true);

      let itemId = 2;
      while (block.getInput(`ITEM${itemId}`) !== null) {
        if (itemId >= this.itemCount) {
          block.removeInput(`ITEM_OR${itemId}`);
          block.removeInput(`ITEM${itemId}`);
        }
        itemId++;
      }

      for (let i = 2; i < block.itemCount; i++) {
        if (block.getInput(`ITEM${i}`) !== null) continue;

        block.appendDummyInput(`ITEM_OR${i}`).appendField("or");
        block.appendValueInput(`ITEM${i}`);

        const shadow = window.workspace.newBlock("element_literal");
        const input = block.getInput(`ITEM${i}`);
        shadow.setShadow(true);
        shadow.initSvg();
        shadow.render();

        input.connection.connect(shadow.outputConnection);
      }

      if (block.itemCount > 2) {
        const minusField = new Blockly.FieldImage(
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K",
          15,
          15,
          { alt: "*", flipRtl: "FALSE" }
        );
        block.appendDummyInput("MINUS").appendField(minusField);
        minusField.setOnClickHandler(function (e) {
          block.itemCount--;
          block.rebuild();
        });
        if (minusField.imageElement_ !== null) {
          minusField.imageElement_.style["cursor"] = "pointer";
        }
      }

      const plusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      block.appendDummyInput("PLUS").appendField(plusField);
      plusField.setOnClickHandler(function (e) {
        block.itemCount++;
        block.rebuild();
      });
      if (plusField.imageElement_ !== null) {
        plusField.imageElement_.style["cursor"] = "pointer";
      }
    },
  },
  function () {}
);

Blockly.Blocks["not_group"] = {
  init: function () {
    this.appendDummyInput().appendField("not");
    this.appendValueInput("VALUE").setCheck([
      "Number",
      "String",
      "Boolean",
      "Vector",
      "Element",
      "Group",
    ]);
    this.setInputsInline(true);
    this.setOutput(true, "Group");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["comparison"] = {
  init: function () {
    this.appendValueInput("A").setCheck([
      "Number",
      "String",
      "Vector",
      "Element",
      "Group",
    ]);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["is", "IS"],
        ["is bigger than", "BIGGER"],
        ["is smaller than", "SMALLER"],
      ]),
      "COMPARISON"
    );
    this.appendValueInput("B").setCheck([
      "Number",
      "String",
      "Vector",
      "Element",
      "Group",
    ]);
    this.setOutput(true, "Boolean");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["change_into"] = {
  init: function () {
    this.appendDummyInput().appendField("change");
    this.appendValueInput("CELL").setCheck("Vector");
    this.appendDummyInput().appendField("into");
    this.appendValueInput("ELEMENT").setCheck(["Element", "Number"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["swap"] = {
  init: function () {
    this.appendDummyInput().appendField("swap");
    this.appendValueInput("A").setCheck("Vector");
    this.appendDummyInput().appendField("with");
    this.appendValueInput("B").setCheck("Vector");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["move"] = {
  init: function () {
    this.appendDummyInput().appendField("swap");
    this.appendValueInput("DIRECTION").setCheck("Vector");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["vector_literal"] = {
  init: function () {
    this.appendValueInput("X").setCheck("Number");
    this.appendValueInput("Y").setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["vector_empty"] = {
  init: function () {
    this.appendDummyInput();
    this.setOutput(true, "Vector");
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["vector_constant"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["● me", "HERE"],
        ["➡ right", "RIGHT"],
        ["⬅ left", "LEFT"],
        ["⬆ up", "UP"],
        ["⬇ down", "DOWN"],
        ["⬈ NE ", "NE"],
        ["⬊ SE", "SE"],
        ["⬋ SW", "SW"],
        ["⬉ NW", "NW"],
        ["? Neighbor", "RAND"],
      ]),
      "VALUE"
    );
    this.setOutput(true, "Vector");
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["me"] = {
  init: function () {
    this.appendDummyInput().appendField("here");
    this.setOutput(true, "Vector");
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["get_data_cell"] = {
  init: function () {
    const dataValidator = (newValue) => {
      if (newValue === "WIND") {
        this.setColour(260);
        this.setOutput(true, "Vector");
      } else {
        this.setColour(210);
        this.setOutput(true, "Number");
      }
    };

    const dataField = new Blockly.FieldDropdown([
      ["⌛ age", "AGE"],
      ["💥 pressure", "PRESSURE"],
      ["💫 density", "DENSITY"],
      ["💨 wind", "WIND"],
      ["⭐ magic", "MAGIC"],
      ["⚡ energy", "ENERGY"],
    ]);
    dataField.setValidator(dataValidator);

    this.appendDummyInput().appendField(dataField, "DATA");

    this.appendDummyInput().appendField("of");
    this.appendValueInput("CELL").setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, ["Number", "Vector"]);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["set_data_cell"] = {
  init: function () {
    this.appendDummyInput().appendField("set");

    const block = this;

    const dataValidator = function (newValue) {
      const input = block.getInput("VALUE");
      if (newValue === "WIND" && block.getColour() === "#5b80a5") {
        block.setColour(260);

        const content = input.connection.targetBlock();
        if (content !== null) {
          input.connection.disconnect();

          const oldShadow = input.connection.targetBlock();
          if (oldShadow !== null) {
            oldShadow.dispose(true);
          } else {
            content.dispose(true);
          }
        }

        input.setCheck("Vector");

        if (content !== null) {
          const shadow = window.workspace.newBlock("vector_literal");
          shadow.initSvg();
          input.connection.connect_(shadow.outputConnection);
          shadow.setShadow(true);

          const xInput = shadow.getInput("X");
          const yInput = shadow.getInput("Y");
          const x = window.workspace.newBlock("number_literal");
          const y = window.workspace.newBlock("number_literal");
          x.initSvg();
          y.initSvg();
          x.setShadow(true);
          y.setShadow(true);
          xInput.connection.connect_(x.outputConnection);
          yInput.connection.connect_(y.outputConnection);
          x.render();
          y.render();

          shadow.render();
        }
      } else if (newValue !== "WIND" && block.getColour() !== "#5b80a5") {
        block.setColour(210);

        const content = input.connection.targetBlock();
        if (content !== null) {
          input.connection.disconnect();

          const oldShadow = input.connection.targetBlock();
          if (oldShadow !== null) {
            oldShadow.dispose(true);
          } else {
            content.dispose(true);
          }
        }

        input.setCheck("Number");

        if (content !== null) {
          const shadow = window.workspace.newBlock("number_literal");
          shadow.initSvg();
          input.connection.connect_(shadow.outputConnection);
          shadow.setShadow(true);
          shadow.render();
        }
      }
    };

    const dataField = new Blockly.FieldDropdown([
      ["⌛ age", "AGE"],
      ["💥 pressure", "PRESSURE"],
      ["💫 density", "DENSITY"],
      ["💨 wind", "WIND"],
      ["⭐ magic", "MAGIC"],
      ["⚡ energy", "ENERGY"],
    ]);
    dataField.setValidator(dataValidator);

    this.appendDummyInput().appendField(dataField, "DATA");

    this.appendDummyInput().appendField("of");
    this.appendValueInput("CELL").setCheck("Vector");
    this.appendDummyInput().appendField("to");
    this.appendValueInput("VALUE").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["random_number"] = {
  init: function () {
    this.appendDummyInput().appendField("random number from");
    this.appendValueInput("MIN").setCheck("Number");
    this.appendDummyInput().appendField("to");
    this.appendValueInput("MAX").setCheck("Number");
    this.setOutput(true, "Number");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["string_literal"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("Hello world!"),
      "VALUE"
    );
    this.setOutput(true, null);
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["print"] = {
  init: function () {
    this.appendDummyInput().appendField("print");
    this.appendValueInput("MESSAGE").setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["bool_literal"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["true", "TRUE"],
        ["false", "FALSE"],
      ]),
      "VALUE"
    );
    this.setOutput(true, "Boolean");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["not"] = {
  init: function () {
    this.appendDummyInput().appendField("not");
    this.appendValueInput("BOOL").setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["boolean_operation"] = {
  init: function () {
    this.appendValueInput("A").setCheck("Boolean");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["and", "AND"],
        ["or", "OR"],
      ]),
      "OPERATION"
    );
    this.appendValueInput("B").setCheck("Boolean");
    this.appendDummyInput().appendField(
      new Blockly.FieldLabelSerializable("➕"),
      "PLUS"
    );
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "boolean_operation",
    message0: "%1 %2 %3 %4",
    args0: [
      {
        type: "input_value",
        name: "A",
        check: "Boolean",
      },
      {
        type: "field_dropdown",
        name: "OPERATION",
        options: [
          ["and", "AND"],
          ["or", "OR"],
        ],
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "B",
        check: "Boolean",
      },
    ],
    inputsInline: true,
    output: "Boolean",
    colour: 330,
    tooltip: "",
    helpUrl: "",
  },
]);

Blockly.Blocks["is_touching"] = {
  init: function () {
    this.appendDummyInput().appendField("is touching");
    this.appendValueInput("ELEMENT").setCheck(["Element", "Group"]);
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setInputsInline(true);
  },
};

Blockly.Blocks["is_block"] = {
  init: function () {
    this.appendValueInput("CELL").setCheck("Vector");
    this.appendDummyInput().appendField("is");
    this.appendValueInput("ELEMENT").setCheck(["Element", "Group"]);
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["one_in"] = {
  init: function () {
    this.appendDummyInput().appendField("one in");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("chance");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

const baseIfInit = Blockly.Blocks["controls_if"].init;
Blockly.Blocks["controls_if"].init = function () {
  baseIfInit.apply(this);
  this.setColour(330);
};

/*Blockly.Blocks['if_value'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("if");
    this.appendValueInput("CONDITION")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("then");
    this.appendValueInput("THEN")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("else");
    this.appendValueInput("ELSE")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("➕"), "PLUS");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};*/

Blockly.defineBlocksWithJsonArray([
  {
    type: "operation",
    message0: "%1 %2 %3 %4",
    args0: [
      {
        type: "input_value",
        name: "A",
        check: ["Number", "Vector"],
      },
      {
        type: "field_dropdown",
        name: "OPERATION",
        options: [
          ["+", "ADD"],
          ["-", "SUBTRACT"],
          ["×", "MULTIPLY"],
          ["÷", "DIVIDE"],
        ],
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "B",
        check: ["Number", "Vector"],
      },
    ],
    output: "Number",
    colour: 210,
    tooltip: "",
    helpUrl: "",
    mutator: "operation_mutator",
  },
]);

Blockly.Extensions.registerMutator(
  "operation_mutator",
  {
    mutationToDom() {
      var container = Blockly.utils.xml.createElement("mutation");
      if (this.implicitType === undefined) this.implicitType = "Number";
      container.setAttribute("implicitType", this.implicitType);
      return container;
    },
    domToMutation(mutation) {
      this.implicitType = mutation.getAttribute("implicitType");
      this.rebuild();
    },
    rebuild() {
      if (this.implicitType === "Vector") {
        this.setColour(260);
        this.setOutput(true, "Vector");
      } else if (this.implicitType === "Number") {
        this.setColour(210);
        this.setOutput(true, "Number");
      }
    },
  },
  function () {
    const block = this;

    block.setOnChange(function (e) {
      if (e.blockId === block.id || e.newParentId === block.id) {
        const aType = getTypeOfValue(block, "A");
        const bType = getTypeOfValue(block, "B");

        if (aType === "Number" && bType === "Number") {
          if (this.implicitType !== "Number") {
            this.implicitType = "Number";
            this.rebuild();
          }
        } else {
          if (this.implicitType !== "Vector") {
            this.implicitType = "Vector";
            this.rebuild();
          }
        }
      }
    });
  }
);

Blockly.Blocks["in_a_random"] = {
  init: function () {
    this.appendDummyInput().appendField("in a random");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["↻ rotation", "ROTATION"],
        ["✥ reflection", "REFLECTION"],
        ["⟷ horizontal reflection", "HORIZONTAL_REFLECTION"],
        ["↕ vertical reflection", "VERTICAL_REFLECTION"],
      ]),
      "NAME"
    );
    this.appendStatementInput("NAME").setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["for_all"] = {
  init: function () {
    this.appendDummyInput().appendField("for each");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["↻ rotation", "ROTATION"],
        ["✥ reflection", "REFLECTION"],
        ["⟷ horizontal reflection", "HORIZONTAL_REFLECTION"],
        ["↕ vertical reflection", "VERTICAL_REFLECTION"],
      ]),
      "NAME"
    );
    this.appendStatementInput("NAME").setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["macro"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("make a block called")
      .appendField(new Blockly.FieldTextInput("foo"), "NAME")
      .appendField("that means");
    this.appendValueInput("VALUE").setCheck(null);
    this.setInputsInline(true);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["macro_function"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("make a block called")
      .appendField(new Blockly.FieldTextInput("foo"), "NAME")
      .appendField("that does");
    this.appendStatementInput("NAME").setCheck(null);
    this.setInputsInline(true);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["macro_function"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("make a block called")
      .appendField(new Blockly.FieldTextInput("foo"), "NAME")
      .appendField("that does");
    this.appendStatementInput("NAME").setCheck(null);
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("➕");
    this.setInputsInline(true);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["value_statement"] = {
  init: function () {
    this.appendStatementInput("STATEMENT").setCheck(null);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["statement_value"] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["value_statement_shadow"] = {
  init: function () {
    this.appendDummyInput().appendField("expression");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["statement_value_shadow"] = {
  init: function () {
    this.appendDummyInput().appendField("value");
    this.setOutput(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["repeat"] = {
  init: function () {
    this.appendValueInput("NUMBER").setCheck("Number").appendField("repeat");
    this.appendDummyInput().appendField("times");
    this.appendStatementInput("STATEMENT").setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["boolean_operation_vertical"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck("Boolean")
      .setAlign(Blockly.ALIGN_CENTRE);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(
        new Blockly.FieldDropdown([
          ["and", "AND"],
          ["or", "OR"],
        ]),
        "OPERATION"
      );
    this.appendValueInput("B")
      .setCheck("Boolean")
      .setAlign(Blockly.ALIGN_CENTRE);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(
        new Blockly.FieldDropdown([
          ["and", "AND"],
          ["or", "OR"],
        ]),
        "OPERATION2"
      );
    this.appendValueInput("C")
      .setCheck("Boolean")
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setInputsInline(false);
    this.setOutput(true, "Boolean");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["get_r_cell"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["⭐ ra", "RA"],
        ["⚡ rb", "RB"],
        ["💎 type", "ELEMENT"],
      ]),
      "DATA"
    );
    this.appendDummyInput().appendField("of");
    this.appendValueInput("CELL").setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["set_r_cell"] = {
  init: function () {
    this.appendDummyInput().appendField("set");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["⭐ ra", "RA"],
        ["⚡ rb", "RB"],
        ["💎 type", "ELEMENT"],
      ]),
      "DATA"
    );
    this.appendDummyInput().appendField("of");
    this.appendValueInput("CELL").setCheck("Vector");
    this.appendDummyInput().appendField("to");
    this.appendValueInput("VALUE").setCheck(["Number", "Element"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
