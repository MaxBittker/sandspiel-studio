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
import { ColorWheelField } from "blockly-field-color-wheel";

// Since we're using json to initialize the field, we'll need to import it.
// import "../fields/BlocklyReactField";
// import "../fields/DateField";
import { globalState, useStore } from "../store.js";
import { getTypeOfValue } from "../generator/generator.js";

Blockly.Blocks["sand_behavior_base"] = {
  init: function () {
    const validator = (value) => {
      useStore
        .getState()
        .setElementName(useStore.getState().selectedElement, value);
      if (globalState.workspace === undefined) return;
      const blocks = globalState.workspace.getAllBlocks();
      for (const block of blocks) {
        if (block.type !== "element_literal") continue;
        block.rebuild();
      }
      return value;
    };

    this.appendDummyInput()
      .appendField("Name:")
      .appendField(
        new Blockly.FieldTextInput("Sand", validator),
        "ELEMENT_NAME"
      );

    this.appendDummyInput()
      .appendField("Color: ")
      .appendField(
        new ColorWheelField("#7faaf0", 150, {
          layoutDirection: "vertical",
        }),
        "COLOR"
      )
      .appendField("»")

      .appendField(
        new ColorWheelField("#7fdab4", 150, {
          layoutDirection: "vertical",
        }),
        "COLOR2"
      )
      .setAlign(Blockly.ALIGN_RIGHT);

    this.setNextStatement(true, null);

    this.setTooltip("Behavior for the element");
    this.setHelpUrl("");
    this.setInputsInline(true);
    this.setDeletable(false);
    this.setMovable(true);
    this.setColour(160);
    //this.setStyle("loop_bglocks");
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
    const laxValidator = function (newValue) {
      return newValue;
    };
    const laxUpdater = function (newValue) {
      this.isTextValid_ = true;
      this.value_ = newValue;
      if (!this.isBeingEdited_) {
        // This should only occur if setValue is triggered programmatically.
        this.isDirty_ = true;
      }

      const options = this.getOptions(true);
      for (let i = 0, option; (option = options[i]); i++) {
        if (option[1] === this.value_) {
          this.selectedOption_ = option;
          return;
        }
      }
      this.selectedOption_ = ["???", newValue.toString()];
    };
    Blockly.FieldDropdown.prototype.doClassValidation_ = laxValidator;
    Blockly.FieldDropdown.prototype.doValueUpdate_ = laxUpdater;

    this.rebuild();

    this.setOutput(true, "Element");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  dynamicOptions: function () {
    const { elements, disabled } = useStore.getState();

    const options = elements
      .filter((e, i) => !disabled[i])
      .map((element) => [element, elements.indexOf(element).toString()]);
    return options;
  },

  rebuild: function () {
    const oldInput = this.getInput("DROPDOWN");
    const oldValue = this.getFieldValue("VALUE");
    if (oldInput !== null) {
      this.removeInput("DROPDOWN");
    }

    let dropdown = new Blockly.FieldDropdown(this.dynamicOptions());
    this.appendDummyInput("DROPDOWN").appendField(dropdown, "VALUE");

    this.setFieldValue(oldValue, "VALUE");
  },
};

Blockly.Blocks["element_cell"] = {
  init: function () {
    this.appendDummyInput().appendField("type of");
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
    message0: "%1",
    args0: [
      {
        type: "input_value",
        name: "ITEM0",
        check: ["Element", "Number"],
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
Blockly.Extensions.unregister("group_mutator");
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
        block.itemCount = 1;
      }

      block.rebuild();
    },
    rebuild() {
      const block = this;

      block.removeInput("PLUS", true);
      block.removeInput("MINUS", true);

      let itemId = 1;
      while (block.getInput(`ITEM${itemId}`) !== null) {
        if (itemId >= this.itemCount) {
          block.removeInput(`ITEM_OR${itemId}`);
          block.removeInput(`ITEM${itemId}`);
        }
        itemId++;
      }

      for (let i = 1; i < block.itemCount; i++) {
        if (block.getInput(`ITEM${i}`) !== null) continue;

        block.appendDummyInput(`ITEM_OR${i}`).appendField("or");
        block.appendValueInput(`ITEM${i}`);

        const shadow = globalState.workspace.newBlock("element_literal");
        const input = block.getInput(`ITEM${i}`);
        shadow.setShadow(true);
        shadow.initSvg();
        shadow.render();

        input.connection.connect(shadow.outputConnection);
      }

      if (block.itemCount > 1) {
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

Blockly.Blocks["clone"] = {
  init: function () {
    this.appendDummyInput().appendField("clone myself");
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
        ["me", "HERE"],
        ["➡ right", "RIGHT"],
        ["⬅ left", "LEFT"],
        ["⬆ up", "UP"],
        ["⬇ down", "DOWN"],
        ["⬈ NE ", "NE"],
        ["⬊ SE", "SE"],
        ["⬋ SW", "SW"],
        ["⬉ NW", "NW"],
        ["? Neighbor", "RAND"],
        ["Arrow Keys", "KB"],
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
          const shadow = globalState.workspace.newBlock("vector_literal");
          shadow.initSvg();
          input.connection.connect_(shadow.outputConnection);
          shadow.setShadow(true);

          const xInput = shadow.getInput("X");
          const yInput = shadow.getInput("Y");
          const x = globalState.workspace.newBlock("number_literal");
          const y = globalState.workspace.newBlock("number_literal");
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
          const shadow = globalState.workspace.newBlock("number_literal");
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
    this.appendDummyInput().appendField("random between");
    this.appendValueInput("MIN").setCheck("Number");
    this.appendDummyInput().appendField("and");
    this.appendValueInput("MAX").setCheck("Number");
    this.setOutput(true, "Number");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.Blocks["keyboard_vector"] = {
  init: function () {
    this.appendDummyInput().appendField("arrow keys direction");
    this.setOutput(true, "Vector");
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.Blocks["cursor_distance"] = {
  init: function () {
    this.appendDummyInput().appendField("distance from cursor");
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
          ["%", "MOD"],
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
Blockly.Extensions.unregister("operation_mutator");
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

Blockly.Blocks["rotated_by"] = {
  init: function () {
    this.appendDummyInput().appendField("rotated by");
    this.appendValueInput("NUMBER").setCheck("Number");

    this.appendStatementInput("BODY").setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

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
const registers = [
  ["Color Fade »", "RA"],
  ["Hue Rotate", "RB"],
  ["Extra Data", "RC"],
];

Blockly.Blocks["get_r_cell"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(registers),
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
      new Blockly.FieldDropdown(registers),
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

Blockly.defineBlocksWithJsonArray([
  {
    type: "that",
    message0: "%1",
    args0: [
      {
        type: "field_label_serializable",
        name: "TEXT",
        text: "that",
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 210,
    tooltip: "",
    helpUrl: "",
    mutator: "that_mutator",
  },
  {
    type: "that_pointer",
    message0: "%1",
    args0: [
      {
        type: "input_dummy",
      },
    ],
    output: null,
    colour: 210,
    //deleteable: false,
    tooltip: "",
    helpUrl: "",
  },
]);
Blockly.Extensions.unregister("that_mutator");
Blockly.Extensions.registerMutator("that_mutator", {
  mutationToDom() {
    const container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("target", this.target);
    container.setAttribute("pointer", this.pointer);
    return container;
  },
  domToMutation(mutation) {
    this.target = mutation.getAttribute("target");
    this.pointer = mutation.getAttribute("pointer");
    this.rebuild();
  },
  rebuild() {
    if (this.pointer === "undefined") {
      const pointer = globalState.workspace.newBlock("that_pointer");
      pointer.initSvg();
      pointer.render();
      this.pointer = pointer.id;
    } else {
      const pointer = globalState.workspace.getBlockById(this.pointer);
      pointer.moveBy(1, 0);
      //pointer.moveTo(position);
    }
  },
});

Blockly.Blocks["key_pressed"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["space bar", " "],
        ["➡ right arrow", "ArrowRight"],
        ["⬅ left arrow", "ArrowLeft"],
        ["⬆ up arrow", "ArrowUp"],
        ["⬇ down arrow", "ArrowDown"],
      ]),
      "KEY"
    );
    this.appendDummyInput().appendField(
      new Blockly.FieldLabelSerializable("is pressed"),
      "TEXT"
    );
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["get_r_cell_short"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(registers),
      "DATA"
    );
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["set_r_cell_short"] = {
  init: function () {
    this.appendDummyInput().appendField("set");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(registers),
      "DATA"
    );
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

Blockly.Blocks["modify_r"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("increase")
      .appendField(new Blockly.FieldDropdown(registers), "DATA");
    this.appendDummyInput().appendField("by");
    this.appendValueInput("VALUE").setCheck(["Number", "Element"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "get_r_cell_flexible",
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "DATA",
        options: registers,
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 210,
    tooltip: "",
    helpUrl: "",
    mutator: "get_r_mutator",
  },
]);

Blockly.Extensions.unregister("get_r_mutator");
Blockly.Extensions.registerMutator("get_r_mutator", {
  mutationToDom() {
    const container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("expanded", this.expanded);
    return container;
  },
  domToMutation(mutation) {
    const expanded = mutation.getAttribute("expanded");
    this.expanded = expanded === "true";
    this.rebuild();
  },
  rebuild() {
    this.removeInput("PLUS", true);
    this.removeInput("MINUS", true);
    this.removeInput("OF", true);
    this.removeInput("CELL", true);

    if (this.expanded) {
      this.appendDummyInput("OF").appendField("of");
      const cell = this.appendValueInput("CELL");

      const shadow = globalState.workspace.newBlock("vector_constant");
      shadow.setShadow(true);
      shadow.initSvg();
      shadow.render();
      cell.connection.connect(shadow.outputConnection);

      const minusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      this.appendDummyInput("MINUS").appendField(minusField);
      minusField.setOnClickHandler(() => {
        this.expanded = false;
        this.rebuild();
      });
      if (minusField.imageElement_ !== null) {
        minusField.imageElement_.style["cursor"] = "pointer";
      }
    } else {
      const plusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      this.appendDummyInput("PLUS").appendField(plusField);
      plusField.setOnClickHandler(() => {
        this.expanded = true;
        this.rebuild();
      });
      if (plusField.imageElement_ !== null) {
        plusField.imageElement_.style["cursor"] = "pointer";
      }
    }
  },
});

Blockly.defineBlocksWithJsonArray([
  {
    type: "set_r_cell_flexible",
    message0: "set %1 %2 %3 to %4 %5",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "field_dropdown",
        name: "DATA",
        options: registers,
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
        name: "TO",
      },
      {
        type: "input_value",
        name: "VALUE",
        check: ["Number", "Vector"],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
    mutator: "set_r_mutator",
  },
]);

Blockly.Extensions.unregister("set_r_mutator");
Blockly.Extensions.registerMutator("set_r_mutator", {
  mutationToDom() {
    const container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("expanded", this.expanded);
    return container;
  },
  domToMutation(mutation) {
    const expanded = mutation.getAttribute("expanded");
    this.expanded = expanded === "true";
    this.rebuild();
  },
  rebuild() {
    this.removeInput("PLUS", true);
    this.removeInput("MINUS", true);
    this.removeInput("OF", true);
    this.removeInput("CELL", true);
    this.removeInput("TO", true);

    const valueBlock = this.getInput("VALUE").connection.targetBlock();
    let valueShadowValue = undefined;
    if (valueBlock !== null && valueBlock.isShadow()) {
      valueShadowValue = valueBlock.getFieldValue("VALUE");
    }
    this.removeInput("VALUE", true);

    // OF CELL
    if (this.expanded) {
      this.appendDummyInput("OF").appendField("of");

      const cell = this.appendValueInput("CELL");
      const cellShadow = globalState.workspace.newBlock("vector_constant");
      cellShadow.setShadow(true);
      cellShadow.initSvg();
      cellShadow.render();
      cell.connection.connect(cellShadow.outputConnection);
    }

    // TO VALUE
    this.appendDummyInput("TO").appendField("to");
    const value = this.appendValueInput("VALUE").setCheck([
      "Number",
      "Element",
    ]);

    const valueShadow = globalState.workspace.newBlock("number_literal");
    valueShadow.setShadow(true);
    valueShadow.initSvg();
    valueShadow.render();
    value.connection.connect(valueShadow.outputConnection);
    if (valueShadowValue !== undefined) {
      valueShadow.setFieldValue(valueShadowValue, "VALUE");
    }
    if (valueBlock !== null) {
      value.connection.connect(valueBlock.outputConnection);
    }

    // PLUS/MINUS
    if (this.expanded) {
      const minusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      this.appendDummyInput("MINUS").appendField(minusField);
      minusField.setOnClickHandler(() => {
        this.expanded = false;
        this.rebuild();
      });
      if (minusField.imageElement_ !== null) {
        minusField.imageElement_.style["cursor"] = "pointer";
      }
    } else {
      const plusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      this.appendDummyInput("PLUS").appendField(plusField);
      plusField.setOnClickHandler(() => {
        this.expanded = true;
        this.rebuild();
      });
      if (plusField.imageElement_ !== null) {
        plusField.imageElement_.style["cursor"] = "pointer";
      }
    }
  },
});

Blockly.defineBlocksWithJsonArray([
  {
    type: "modify_r_cell_flexible",
    message0: "increase %1 %2 %3 by %4 %5",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "field_dropdown",
        name: "DATA",
        options: registers,
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_dummy",
        name: "BY",
      },
      {
        type: "input_value",
        name: "VALUE",
        check: ["Number", "Vector"],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
    mutator: "modify_r_mutator",
  },
]);

Blockly.Extensions.unregister("modify_r_mutator");
Blockly.Extensions.registerMutator("modify_r_mutator", {
  mutationToDom() {
    const container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("expanded", this.expanded);
    return container;
  },
  domToMutation(mutation) {
    const expanded = mutation.getAttribute("expanded");
    this.expanded = expanded === "true";
    this.rebuild();
  },
  rebuild() {
    this.removeInput("PLUS", true);
    this.removeInput("MINUS", true);
    this.removeInput("OF", true);
    this.removeInput("CELL", true);
    this.removeInput("BY", true);

    const valueBlock = this.getInput("VALUE").connection.targetBlock();
    let valueShadowValue = undefined;
    if (valueBlock !== null && valueBlock.isShadow()) {
      valueShadowValue = valueBlock.getFieldValue("VALUE");
    }
    this.removeInput("VALUE", true);

    // OF CELL
    if (this.expanded) {
      this.appendDummyInput("OF").appendField("of");

      const cell = this.appendValueInput("CELL");
      const cellShadow = globalState.workspace.newBlock("vector_constant");
      cellShadow.setShadow(true);
      cellShadow.initSvg();
      cellShadow.render();
      cell.connection.connect(cellShadow.outputConnection);
    }

    // TO VALUE
    this.appendDummyInput("BY").appendField("by");
    const value = this.appendValueInput("VALUE").setCheck([
      "Number",
      "Element",
    ]);

    const valueShadow = globalState.workspace.newBlock("number_literal");
    valueShadow.setShadow(true);
    valueShadow.initSvg();
    valueShadow.render();
    value.connection.connect(valueShadow.outputConnection);
    if (valueShadowValue !== undefined) {
      valueShadow.setFieldValue(valueShadowValue, "VALUE");
    }
    if (valueBlock !== null) {
      value.connection.connect(valueBlock.outputConnection);
    }

    // PLUS/MINUS
    if (this.expanded) {
      const minusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      this.appendDummyInput("MINUS").appendField(minusField);
      minusField.setOnClickHandler(() => {
        this.expanded = false;
        this.rebuild();
      });
      if (minusField.imageElement_ !== null) {
        minusField.imageElement_.style["cursor"] = "pointer";
      }
    } else {
      const plusField = new Blockly.FieldImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==",
        15,
        15,
        { alt: "*", flipRtl: "FALSE" }
      );
      this.appendDummyInput("PLUS").appendField(plusField);
      plusField.setOnClickHandler(() => {
        this.expanded = true;
        this.rebuild();
      });
      if (plusField.imageElement_ !== null) {
        plusField.imageElement_.style["cursor"] = "pointer";
      }
    }
  },
});

Blockly.Blocks["comment"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldLabelSerializable("note:"), "NOTE")
      .appendField(new Blockly.FieldTextInput("    "), "COMMENT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
