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
Blockly.Blocks['number_literal'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldNumber(0, -100, 100, 1), "VALUE");
    this.setOutput(true, "Number");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['element_literal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Air","AIR"], ["Water","WATER"], ["Sand","SAND"], ["Wall","WALL"], ["Plant","PLANT"], ["Stone","STONE"], ["Cloner","CLONER"], ["Fire","FIRE"], ["Ice","ICE"], ["Gas","GAS"], ["Mite","MITE"], ["Wood","WOOD"], ["Fungus","FUNGUS"], ["Seed","SEED"], ["Lava","LAVA"], ["Acid","ACID"], ["Dust","DUST"], ["Oil","OIL"], ["Rocket","ROCKET"]]), "VALUE");
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

Blockly.defineBlocksWithJsonArray([
  {
    "type": "group",
    "message0": "%1 or %2 %3",
    "args0": [
      {
        "type": "input_value",
        "name": "ITEM0",
        "check": "Element"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "ITEM1",
        "check": "Element"
      },
      /*{
        "name": "MINUS",
        "type": "field_image",
        "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K",
        "width": 15,
        "height": 15,
        "alt": "*",
        "flipRtl": false,
      },*/
      /*{
        "name": "PLUS",
        "type": "field_image",
        "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==",
        "width": 15,
        "height": 15,
        "alt": "*",
        "flipRtl": false,
      }*/
    ],
    "inputsInline": true,
    "output": "Group",
    "colour": 160,
    "tooltip": "",
    "helpUrl": "",
    "mutator": "group_mutator",
  }
])

Blockly.Extensions.registerMutator(
  "group_mutator",
  {
    mutationToDom() {
      var container = Blockly.utils.xml.createElement('mutation');
      container.setAttribute('extraItems', this.extraItems);
      return container;
    },
    domToMutation(mutation) {
      const block = this;
      block.extraItems = parseInt(mutation.getAttribute('extraItems'));
      if (isNaN(block.extraItems)) {
        block.extraItems = 0;
      }
      
      block.rebuild();
    },
    rebuild() {
      const block = this;

      block.removeInput("PLUS", true);
      block.removeInput("MINUS", true);

      let extraItemId = 0;
      while (block.getInput(`EXTRA_ITEM${extraItemId}`) !== null) {
        block.removeInput(`EXTRA_ITEM${extraItemId}`);
        extraItemId++;
      }

      for (let i = 0; i < block.extraItems; i++) {
        block.appendValueInput(`EXTRA_ITEM${i}`);
      }

      if (block.extraItems > 0) {
        const minusField = new Blockly.FieldImage("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K", 15, 15, { alt: "*", flipRtl: "FALSE" });
        block.appendDummyInput("MINUS").appendField(minusField);
        minusField.setOnClickHandler(function(e) {
          block.extraItems--
          block.rebuild();
        });
        if (minusField.imageElement_ !== null) {
          minusField.imageElement_.style["cursor"] = "pointer";
        }
      }

      const plusField = new Blockly.FieldImage("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==", 15, 15, { alt: "*", flipRtl: "FALSE" });
      block.appendDummyInput("PLUS").appendField(plusField);
      plusField.setOnClickHandler(function(e) {
        block.extraItems++;
        block.rebuild();
      });
      if (plusField.imageElement_ !== null) {
        plusField.imageElement_.style["cursor"] = "pointer";
      }
    },
  },
  function() {

  },
);

/*Blockly.Extensions.register(
  "group_click_extension",
  function() {
    const block = this;

    const plusField = block.getField("PLUS");
    plusField.setOnClickHandler(function(e) {
      block.appendValueInput(`FOO${block.inputList.length}`);
    });
    
    const minusField = block.getField("MINUS");
    minusField.setOnClickHandler(function(e) {
      block.removeInput(`FOO${block.inputList.length-1}`, true);
    });
  },
)*/

/*Blockly.Blocks['group'] = {
  init: function() {
    this.appendValueInput("ITEM0")
        .setCheck(["Element"]);
    this.appendDummyInput()
        .appendField("or");
    this.appendValueInput("ITEM1")
        .setCheck(["Element"]);

    const plusFieldImage = new Blockly.FieldImage("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==", 15, 15, { alt: "*", flipRtl: "FALSE" })

    this.appendDummyInput()
        .appendField(plusFieldImage);


    this.setInputsInline(true);
    this.setOutput(true, "Group");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setMutator(new Blockly.Mutator([]))
  },
};*/

Blockly.Blocks['not_group'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("not");
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", "Boolean", "Vector", "Element", "Group"]);
    this.setInputsInline(true);
    this.setOutput(true, "Group");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['comparison'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck(["Number", "String", "Vector", "Element", "Group"]);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["is","IS"], ["is bigger than","BIGGER"], ["is smaller than","SMALLER"]]), "COMPARISON");
    this.appendValueInput("B")
        .setCheck(["Number", "String", "Vector", "Element", "Group"]);
    this.setOutput(true, "Boolean");
    this.setColour(330);
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

Blockly.Blocks['swap'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("swap");
    this.appendValueInput("A")
        .setCheck("Vector");
    this.appendDummyInput()
        .appendField("with");
    this.appendValueInput("B")
        .setCheck("Vector");
    this.setInputsInline(true);
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

Blockly.Blocks['vector_empty'] = {
  init: function() {
    this.appendDummyInput();
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['vector_constant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["● here","HERE"], ["➡ right","RIGHT"], ["⬅ left","LEFT"], ["⬆ up","UP"], ["⬇ down","DOWN"]]), "VALUE");
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['me'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("here");
    this.setOutput(true, "Vector");
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['get_data_cell'] = {
  init: function() {
    

    const dataValidator = (newValue) => {
      if (newValue === "WIND") {
        this.setColour(260);
        this.setOutput(true, "Vector");
      } else {
        this.setColour(210);
        this.setOutput(true, "Number");
      }
    };

    const dataField = new Blockly.FieldDropdown([["⌛ age","AGE"], ["💥 pressure","PRESSURE"], ["💫 density","DENSITY"], ["💨 wind","WIND"], ["⭐ magic","MAGIC"], ["⚡ energy","ENERGY"]]);
    dataField.setValidator(dataValidator);

    this.appendDummyInput().appendField(dataField, "DATA");

    this.appendDummyInput()
        .appendField("of");
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.setInputsInline(true);
    this.setOutput(true, ["Number", "Vector"]);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");

  }
};

Blockly.Blocks['set_data_cell'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set");

    const block = this

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

    const dataField = new Blockly.FieldDropdown([["⌛ age","AGE"], ["💥 pressure","PRESSURE"], ["💫 density","DENSITY"], ["💨 wind","WIND"], ["⭐ magic","MAGIC"], ["⚡ energy","ENERGY"]]);
    dataField.setValidator(dataValidator);

    this.appendDummyInput().appendField(dataField, "DATA");

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

Blockly.Blocks['string_literal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Hello world!"), "VALUE");
    this.setOutput(true, null);
    this.setColour(300);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['print'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("print");
    this.appendValueInput("MESSAGE")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['bool_literal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["true","TRUE"], ["false","FALSE"]]), "VALUE");
    this.setOutput(true, "Boolean");
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['not'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("not");
    this.appendValueInput("BOOL")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['boolean_operation'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["and","AND"], ["or","OR"]]), "OPERATION");
    this.appendValueInput("B")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("➕"), "PLUS");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['is_touching'] = {
  init: function() {
    this.appendValueInput("CELL")
        .setCheck("Vector");
    this.appendDummyInput()
        .appendField("is touching");
    this.appendValueInput("ELEMENT")
        .setCheck(["Element", "Group"]);
    this.setOutput(true, "Boolean");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['one_in'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("one in");
    this.appendValueInput("NUMBER")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("chance");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Hacky - remove 'do' text
/*const baseIfInit = Blockly.Blocks["controls_if"].init;
Blockly.Blocks["controls_if"].init = function() {
  baseIfInit.apply(this);
  this.setColour(330);

  const ifDoInput = this.getInput("DO0");
  ifDoInput.fieldRow.length = 0;

  this.setOnChange(function(e) {
    for (let i = 0; i < this.elseifCount_; i++) {
      const inputName = `DO${i+1}`
      this.removeInput(inputName);
      this.appendStatementInput(inputName)
    }
  });
};*/

const baseIfInit = Blockly.Blocks["controls_if"].init;
Blockly.Blocks["controls_if"].init = function() {
  baseIfInit.apply(this);
  this.setColour(330);
};

Blockly.Blocks['if'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("if");
    this.appendValueInput("CONDITION")
        .setCheck("Boolean");
    this.appendStatementInput("THEN")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("➕"), "PLUS");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['if_value'] = {
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
};

Blockly.Blocks['if_else'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("if");
    this.appendValueInput("CONDITION")
        .setCheck("Boolean");
    this.appendStatementInput("THEN")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("else");
    this.appendStatementInput("ELSE")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['operation'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck(["Number", "Vector"]);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["+","ADD"], ["-","SUBTRACT"], ["×","MULTIPLY"], ["÷","DIVIDE"]]), "OPERATION");
    this.appendValueInput("B")
        .setCheck(["Number", "Vector"]);
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("➕"), "PLUS");
    this.setOutput(true, "Number");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['in_a_random'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("in a random");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["⭯ rotation","ROTATION"], ["✥ reflection","REFLECTION"], ["⟷ horizontal reflection","HORIZONTAL_REFLECTION"], ["↕ vertical reflection","VERTICAL_REFLECTION"]]), "NAME");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['for_all'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("for each");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["⭯ rotation","ROTATION"], ["✥ reflection","REFLECTION"], ["⟷ horizontal reflection","HORIZONTAL_REFLECTION"], ["↕ vertical reflection","VERTICAL_REFLECTION"]]), "NAME");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['macro'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("make a block called")
        .appendField(new Blockly.FieldTextInput("foo"), "NAME")
        .appendField("that means");
    this.appendValueInput("VALUE")
        .setCheck(null);
    this.setInputsInline(true);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['macro_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("make a block called")
        .appendField(new Blockly.FieldTextInput("foo"), "NAME")
        .appendField("that does");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(true);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['macro_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("make a block called")
        .appendField(new Blockly.FieldTextInput("foo"), "NAME")
        .appendField("that does");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("➕");
    this.setInputsInline(true);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['value_statement'] = {
  init: function() {
    this.appendStatementInput("STATEMENT")
        .setCheck(null);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['statement_value'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['value_statement_shadow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("expression");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['statement_value_shadow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("value");
    this.setOutput(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['repeat'] = {
  init: function() {
    this.appendValueInput("NUMBER")
        .setCheck("Number")
        .appendField("repeat");
    this.appendDummyInput()
        .appendField("times");
    this.appendStatementInput("STATEMENT")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['boolean_operation_vertical'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean")
        .setAlign(Blockly.ALIGN_CENTRE);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldDropdown([["and","AND"], ["or","OR"]]), "OPERATION");
    this.appendValueInput("B")
        .setCheck("Boolean")
        .setAlign(Blockly.ALIGN_CENTRE);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldDropdown([["and","AND"], ["or","OR"]]), "OPERATION2");
    this.appendValueInput("C")
        .setCheck("Boolean")
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setInputsInline(false);
    this.setOutput(true, "Boolean");
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};