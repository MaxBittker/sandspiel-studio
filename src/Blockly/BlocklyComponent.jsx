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
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from "react";
import throttle from "lodash/throttle";

import Blockly from "blockly";
import { CrossTabCopyPaste } from "@blockly/plugin-cross-tab-copy-paste";
import "@blockly/block-plus-minus";
// import {
//   ContinuousToolbox,
//   ContinuousFlyout,
//   ContinuousMetrics,
// } from "@blockly/continuous-toolbox";
import locale from "blockly/msg/en";
// import "blockly/blocks";

Blockly.setLocale(locale);

let CustomRenderer = function (name) {
  CustomRenderer.superClass_.constructor.call(this, name);
};
Blockly.utils.object.inherits(CustomRenderer, Blockly.zelos.Renderer);
CustomRenderer.prototype.makeConstants_ = function () {
  return new CustomConstantsProvider();
};
let CustomConstantsProvider = function () {
  // Set up all of the constants from the base provider.
  CustomConstantsProvider.superClass_.constructor.call(this);

  this.FIELD_COLOUR_FULL_BLOCK = false;
  this.ADD_START_HATS = true;
  this.FIELD_COLOUR_DEFAULT_WIDTH = 70;
  this.FIELD_COLOUR_DEFAULT_HEIGHT = 30;
  this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = 12;
  this.STATEMENT_INPUT_PADDING_LEFT = 12;

  this.FIELD_DROPDOWN_COLOURED_DIV = true;

  this.CORNER_RADIUS = 4; //default: 4
  this.FULL_BLOCK_FIELDS = true;
  this.MIN_BLOCK_WIDTH = 4; //default: 8
  this.MEDIUM_PADDING = 8; //default: 8
  this.NOTCH_OFFSET_LEFT = 12; //default: 12
  this.NOTCH_WIDTH = 36; //default: 36
};
Blockly.utils.object.inherits(
  CustomConstantsProvider,
  Blockly.zelos.ConstantProvider
);
Blockly.blockRendering.unregister("custom_renderer");
Blockly.blockRendering.register("custom_renderer", CustomRenderer);

if (Blockly.ContextMenuRegistry.registry.getItem("blockCopyToStorage")) {
  Blockly.ContextMenuRegistry.registry.unregister("blockCopyToStorage");
}
if (Blockly.ContextMenuRegistry.registry.getItem("blockPasteFromStorage")) {
  Blockly.ContextMenuRegistry.registry.unregister("blockPasteFromStorage");
}

const plugin = new CrossTabCopyPaste();
plugin.init({
  contextMenu: true,
  shortcut: true,
});

// optional: You can change the position of the menu added to the context menu.
Blockly.ContextMenuRegistry.registry.getItem("blockCopyToStorage").weight = 2;
Blockly.ContextMenuRegistry.registry.getItem(
  "blockPasteFromStorage"
).weight = 3;

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
  }

  componentDidMount() {
    const { initialXml, children, ...rest } = this.props;
    this.primaryWorkspace = Blockly.inject(this.blocklyDiv.current, {
      toolbox: this.toolbox.current,
      ...rest,
    });

    //this.primaryWorkspace.addChangeListener(Blockly.Events.disableOrphans);

    let callback = (entries) => {
      Blockly.svgResize(this.primaryWorkspace);
    };
    callback = throttle(callback, 32);
    const resize_ob = new ResizeObserver(callback);

    resize_ob.observe(document.querySelector("#blocklyDiv"));

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(initialXml),
        this.primaryWorkspace
      );
    }
  }

  get workspace() {
    return this.primaryWorkspace;
  }

  setXml(xml) {
    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(xml),
      this.primaryWorkspace
    );
  }

  render() {
    const { children, style } = this.props;

    return (
      <React.Fragment>
        <div ref={this.blocklyDiv} id="blocklyDiv" style={style} />
        <xml
          xmlns="https://developers.google.com/blockly/xml"
          is="blockly"
          style={{ display: "none" }}
          ref={this.toolbox}
        >
          {children}
        </xml>
      </React.Fragment>
    );
  }
}

export default BlocklyComponent;
