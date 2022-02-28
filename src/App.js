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

  //console.log(xmlText);
  window.localStorage.setItem("code" + element, xmlText);
  //console.log(code);
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
          <Block type="number_literal">
            <Field name="VALUE">0</Field>
          </Block>
          <Block type="element_literal">
            <Field name="VALUE">2</Field>
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

        </BlocklyComponent>
      </header>
    </div>
  );
};

export default App;
