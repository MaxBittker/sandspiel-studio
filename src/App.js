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
import Sand, { elements } from "./Sand.js";
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
  let code = BlocklyJS.workspaceToCode(window.workspace);

  code = prettier.format(code, {
    parser: "babel",
    plugins: [parserBabel],
  });
  let xml = Xml.workspaceToDom(window.workspace);
  let xmlText = Xml.domToPrettyText(xml);

  console.log(xmlText);
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
          readOnly={false}
          trashcan={true}
          media={"media/"}
          renderer={"zelos"}
          move={{
            scrollbars: false,
            drag: false,
            wheel: false,
          }}
          initialXml={window.localStorage.getItem("code") || starterXMLs[1]}
        >
          <Category name="APIs">
            <Block type="get_cell" />
            <Block type="set_cell" />
            <Block type="swap_cells" />
            <Block type="element_dropdown"></Block>

            <Block type="test_react_field" />
            <Block type="test_react_date_field" />
          </Category>
          <Category name="Blocks">
            <Block type="controls_if" />
            {/* <Block type="controls_ifelse" /> */}
            <Block type="logic_compare" />
            <Block type="logic_operation" />
            <Block type="math_number" gap="32">
              <Field name="NUM">1</Field>
            </Block>
            <Block type="math_arithmetic">
              <Value name="A">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="B">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_single">
              <Value name="NUM">
                <Shadow type="math_number">
                  <Field name="NUM">9</Field>
                </Shadow>
              </Value>
            </Block>

            <Block type="math_number_property">
              <Value name="NUMBER_TO_CHECK">
                <Shadow type="math_number">
                  <Field name="NUM">0</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_round">
              <Value name="NUM">
                <Shadow type="math_number">
                  <Field name="NUM">3.1</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_modulo">
              <Value name="DIVIDEND">
                <Shadow type="math_number">
                  <Field name="NUM">64</Field>
                </Shadow>
              </Value>
              <Value name="DIVISOR">
                <Shadow type="math_number">
                  <Field name="NUM">10</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_constrain">
              <Value name="VALUE">
                <Shadow type="math_number">
                  <Field name="NUM">50</Field>
                </Shadow>
              </Value>
              <Value name="LOW">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="HIGH">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_random_int">
              <Value name="FROM">
                <Shadow type="math_number">
                  <Field name="NUM">1</Field>
                </Shadow>
              </Value>
              <Value name="TO">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="math_random_float"></Block>

            <Block type="logic_negate" />
            <Block type="logic_boolean" />
            <Block type="colour_picker"></Block>
            <Block type="colour_random"></Block>
            <Block type="colour_rgb">
              <Value name="RED">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
              <Value name="GREEN">
                <Shadow type="math_number">
                  <Field name="NUM">50</Field>
                </Shadow>
              </Value>
              <Value name="BLUE">
                <Shadow type="math_number">
                  <Field name="NUM">0</Field>
                </Shadow>
              </Value>
            </Block>
          </Category>

          <Block type="colour_blend">
            <Value name="COLOUR1">
              <Shadow type="colour_picker">
                <Field name="COLOUR">#ff0000</Field>
              </Shadow>
            </Value>
            <Value name="COLOUR2">
              <Shadow type="colour_picker">
                <Field name="COLOUR">#3333ff</Field>
              </Shadow>
            </Value>
            <Value name="RATIO">
              <Shadow type="math_number">
                <Field name="NUM">0.5</Field>
              </Shadow>
            </Value>
          </Block>
          <Category
            name="Variables"
            categorystyle="variable_category"
            custom="VARIABLE"
          ></Category>
        </BlocklyComponent>
      </header>
    </div>
  );
};

export default App;
