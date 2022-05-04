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
this.ADD_START_HATS = true
  this.FIELD_COLOUR_DEFAULT_WIDTH = 70
  this.FIELD_COLOUR_DEFAULT_HEIGHT = 30;
  this.FIELD_DROPDOWN_COLOURED_DIV = true;
};
Blockly.utils.object.inherits(
  CustomConstantsProvider,
  Blockly.zelos.ConstantProvider
);
Blockly.blockRendering.unregister("custom_renderer");
Blockly.blockRendering.register("custom_renderer", CustomRenderer);

console.log("registered")
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
    callback = throttle(callback, 100);
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
