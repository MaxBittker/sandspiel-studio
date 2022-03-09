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
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React, { useRef, useEffect } from "react";
import parserBabel from "prettier/parser-babel";
import { Xml } from "blockly/core";
import BlocklyJS from "blockly/javascript";
import starterXMLs from "./starterblocks";

import "./App.css";
import Sand from "./Sand.js";
import useStore from "./store";

import BlocklyComponent, {
  Block,
  Category,
  Value,
  Field,
  Shadow,
} from "./Blockly";

import prettier from "prettier";

import "./blocks/customblocks";
import "./generator/generator";

window.xmls = starterXMLs.map((v, i) => {
  return window.localStorage.getItem("code" + i) || v;
});
//todo generate all the code on start
window.xmls.forEach((e, i) => {});
function generateCode(element, dom) {
  const baseBlock = window.workspace.topBlocks_[0];
  let code = BlocklyJS.blockToCode(baseBlock);
  
  code = prettier.format(code, {
    parser: "babel",
    plugins: [parserBabel],
  });

  let xml = Xml.workspaceToDom(window.workspace);
  let xmlText = Xml.domToPrettyText(xml);

  //console.log(xmlText);
  window.localStorage.setItem("code" + element, xmlText);
  console.log(code);
  // eslint-disable-next-line no-new-func
  let fn = Function(code);
  window.xmls[element] = xmlText;
  window.updaters[element] = fn;
}

const App = () => {
  let simpleWorkspace = useRef();
  const selectedElement = useStore((state) => state.selectedElement);

  useEffect(() => {
    if (simpleWorkspace.current) {
      let ws = simpleWorkspace.current.primaryWorkspace;

      window.workspace = simpleWorkspace.current.primaryWorkspace;
      let cb = () => generateCode(selectedElement);
      ws.addChangeListener(cb);
      return () => {
        ws.removeChangeListener(cb);
      };
    }
  }, [simpleWorkspace, selectedElement]);

  useEffect(() => {
    if (!simpleWorkspace.current) return;
    simpleWorkspace.current.primaryWorkspace.clear();
    Xml.domToWorkspace(
      Xml.textToDom(window.xmls[window.selectedElement]),
      simpleWorkspace.current.primaryWorkspace
    );
  }, [selectedElement]);
  return (
    <div className="App">
      <header className="App-header">
        <Sand />

        <BlocklyComponent
          ref={simpleWorkspace}
          collapse={false}
          comments={false}
          disable={false}
          maxBlocks={Infinity}
          readOnly={false}
          trashcan={false}
          media={"media/"}
          renderer={"zelos"}
          move={{
            scrollbars: true,
            drag: true,
            wheel: false,
          }}
          initialXml={window.localStorage.getItem("code") || starterXMLs[1]}
        >

  {/*
  
    The toolbox below was made at https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
    and copy-pasted here!

  */}
 <block type="element_literal">
    <field name="VALUE">SAND</field>
  </block>
  <block type="element_cell">
    <value name="CELL">
      <shadow type="vector_constant">
        <field name="VALUE">HERE</field>
      </shadow>
    </value>
  </block>
  <block type="change_into">
    <value name="CELL">
      <shadow type="vector_constant">
        <field name="VALUE">HERE</field>
      </shadow>
    </value>
    <value name="ELEMENT">
      <shadow type="element_literal">
        <field name="VALUE">SAND</field>
      </shadow>
    </value>
  </block>
  <block type="swap">
    <value name="A">
      <shadow type="vector_constant">
        <field name="VALUE">HERE</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="vector_constant">
        <field name="VALUE">DOWN</field>
      </shadow>
    </value>
  </block>
  <block type="is_touching">
    <value name="CELL">
      <shadow type="vector_constant">
        <field name="VALUE">HERE</field>
      </shadow>
    </value>
    <value name="ELEMENT">
      <shadow type="element_literal">
        <field name="VALUE">SAND</field>
      </shadow>
    </value>
  </block>
  <block type="vector_constant">
    <field name="VALUE">HERE</field>
  </block>
  <block type="vector_literal">
    <value name="X">
      <shadow type="number_literal">
        <field name="VALUE">0</field>
      </shadow>
    </value>
    <value name="Y">
      <shadow type="number_literal">
        <field name="VALUE">0</field>
      </shadow>
    </value>
  </block>
  <block type="in_a_random">
    <field name="NAME">ROTATION</field>
  </block>
  <block type="for_all">
    <field name="NAME">ROTATION</field>
  </block>
  <block type="number_literal">
    <field name="VALUE">0</field>
  </block>
  <block type="operation">
    <field name="OPERATION">ADD</field>
    <value name="A">
      <shadow type="number_literal">
        <field name="VALUE">0</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="number_literal">
        <field name="VALUE">0</field>
      </shadow>
    </value>
  </block>
  <block type="random_number">
    <value name="MIN">
      <shadow type="number_literal">
        <field name="VALUE">0</field>
      </shadow>
    </value>
    <value name="MAX">
      <shadow type="number_literal">
        <field name="VALUE">0</field>
      </shadow>
    </value>
  </block>
  <block type="one_in">
    <value name="NUMBER">
      <shadow type="number_literal">
        <field name="VALUE">2</field>
      </shadow>
    </value>
  </block>
  <block type="repeat">
    <value name="NUMBER">
      <shadow type="number_literal">
        <field name="VALUE">2</field>
      </shadow>
    </value>
  </block>
  <block type="controls_if"></block>
  <block type="comparison">
    <field name="COMPARISON">IS</field>
  </block>
  <block type="boolean_operation">
    <field name="OPERATION">AND</field>
  </block>
  <block type="not"></block>
  <block type="bool_literal">
    <field name="VALUE">TRUE</field>
  </block>
  <block type="print">
    <value name="MESSAGE">
      <shadow type="string_literal">
        <field name="VALUE">Hello world!</field>
      </shadow>
    </value>
  </block>

        </BlocklyComponent>
      </header>
    </div>
  );
};

export default App;
