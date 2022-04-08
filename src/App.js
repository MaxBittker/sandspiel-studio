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

import BlocklyComponent, { Block, Value, Field, Shadow } from "./Blockly";

import prettier from "prettier";

import "./blocks/customblocks";
import "./generator/generator";

window.xmls = starterXMLs.map((v, i) => {
  return window.localStorage.getItem("code" + i) || v;
});
//todo generate all the code on start
window.xmls.forEach((e, i) => {});
function generateCode(element, dom) {
  let baseBlock = undefined;
  for (let i = 0; i < window.workspace.topBlocks_.length; i++) {
    const block = window.workspace.topBlocks_[i];
    if (block.type == "sand_behavior_base") {
      baseBlock = block;
      break;
    }
  }

  let code = BlocklyJS.blockToCode(baseBlock);

  code = prettier.format(code, {
    parser: "babel",
    plugins: [parserBabel]
  });

  let xml = Xml.workspaceToDom(window.workspace);
  let xmlText = Xml.domToPrettyText(xml);

  //console.log(xmlText);
  window.localStorage.setItem("code" + element, xmlText);
  //console.log(code);
  // eslint-disable-next-line no-new-func
  let fn = Function(code);
  window.xmls[element] = xmlText;
  window.updaters[element] = fn;
}
export function downloadElements() {
  let starterblocks = `
const a = [
  \`${window.xmls.map((a) => a.replaceAll("`", "-")).join("`,\n`")}\`
];
export default a;

`;

  let a = document.createElement("a");
  let blob = new Blob([starterblocks], { type: "octet/stream" }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `blocks-${Date.now()}.js`;
  a.click();
  window.URL.revokeObjectURL(url);
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
          scrollbars: false
          // drag: true,
          // wheel: true,
        }}
        initialXml={window.localStorage.getItem("code") || starterXMLs[1]}
      >
        {/* =================================================

  The toolbox below was made at https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
  and copy-pasted here!

================================================= */}
        <Block type="element_literal">
          <Field name="VALUE">SAND</Field>
        </Block>
        <Block type="move">
          <Value name="DIRECTION">
            <Shadow type="vector_constant">
              <Field name="VALUE">DOWN</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="is_block">
          <Value name="CELL">
            <Shadow type="vector_constant">
              <Field name="VALUE">DOWN</Field>
            </Shadow>
          </Value>
          <Value name="ELEMENT">
            <Shadow type="element_literal">
              <Field name="VALUE">AIR</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="is_touching">
          <Value name="CELL">
            <Shadow type="vector_constant">
              <Field name="VALUE">HERE</Field>
            </Shadow>
          </Value>
          <Value name="ELEMENT">
            <Shadow type="element_literal">
              <Field name="VALUE">SAND</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="element_cell">
          <Value name="CELL">
            <Shadow type="vector_constant">
              <Field name="VALUE">HERE</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="change_into">
          <Value name="CELL">
            <Shadow type="vector_constant">
              <Field name="VALUE">HERE</Field>
            </Shadow>
          </Value>
          <Value name="ELEMENT">
            <Shadow type="element_literal">
              <Field name="VALUE">SAND</Field>
            </Shadow>
          </Value>
        </Block>
        {/* <Block type="swap">
          <Value name="A">
            <Shadow type="vector_constant">
              <Field name="VALUE">HERE</Field>
            </Shadow>
          </Value>
          <Value name="B">
            <Shadow type="vector_constant">
              <Field name="VALUE">DOWN</Field>
            </Shadow>
          </Value>
        </Block> */}
        <Block type="group">
          <Value name="ITEM0">
            <Shadow type="element_literal">
              <Field name="VALUE">SAND</Field>
            </Shadow>
          </Value>
          <Value name="ITEM1">
            <Shadow type="element_literal">
              <Field name="VALUE">WATER</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="vector_constant">
          <Field name="VALUE">HERE</Field>
        </Block>
        <Block type="vector_literal">
          <Value name="X">
            <Shadow type="number_literal">
              <Field name="VALUE">0</Field>
            </Shadow>
          </Value>
          <Value name="Y">
            <Shadow type="number_literal">
              <Field name="VALUE">0</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="in_a_random">
          <Field name="NAME">ROTATION</Field>
        </Block>
        <Block type="for_all">
          <Field name="NAME">ROTATION</Field>
        </Block>
        <Block type="number_literal">
          <Field name="VALUE">0</Field>
        </Block>
        <Block type="operation">
          <Field name="OPERATION">ADD</Field>
          <Value name="A">
            <Shadow type="number_literal">
              <Field name="VALUE">0</Field>
            </Shadow>
          </Value>
          <Value name="B">
            <Shadow type="number_literal">
              <Field name="VALUE">0</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="random_number">
          <Value name="MIN">
            <Shadow type="number_literal">
              <Field name="VALUE">1</Field>
            </Shadow>
          </Value>
          <Value name="MAX">
            <Shadow type="number_literal">
              <Field name="VALUE">10</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="one_in">
          <Value name="NUMBER">
            <Shadow type="number_literal">
              <Field name="VALUE">2</Field>
            </Shadow>
          </Value>
        </Block>
        {/* <Block type="repeat">
          <Value name="NUMBER">
            <Shadow type="number_literal">
              <Field name="VALUE">2</Field>
            </Shadow>
          </Value>
        </Block> */}
        <Block type="controls_if"></Block>
        {/* <Block type="if"></Block> */}
        <Block type="comparison">
          <Field name="COMPARISON">IS</Field>
        </Block>
        <Block type="boolean_operation">
          <Field name="OPERATION">AND</Field>
        </Block>
        <Block type="bool_literal">
          <Field name="VALUE">TRUE</Field>
        </Block>
        <Block type="not"></Block>
        <Block type="set_r_cell">
          <Field name="DATA">RA</Field>
          <Value name="CELL">
            <Shadow type="vector_constant">
              <Field name="VALUE">HERE</Field>
            </Shadow>
          </Value>
          <Value name="VALUE">
            <Shadow type="number_literal">
              <Field name="VALUE">0</Field>
            </Shadow>
          </Value>
        </Block>
        <Block type="get_r_cell">
          <Field name="DATA">RA</Field>
          <Value name="CELL">
            <Shadow type="vector_constant">
              <Field name="VALUE">HERE</Field>
            </Shadow>
          </Value>
        </Block>
        {/* ================================================= */}
      </BlocklyComponent>
      <Sand />
    </div>
  );
};

export default App;
