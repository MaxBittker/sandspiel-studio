import React, { useRef, useState, useEffect } from "react";
import parserBabel from "prettier/parser-babel";
import { Xml } from "blockly/core";
import BlocklyJS from "blockly/javascript";
import starterXMLs from "./starterblocks.json";
import Sand from "./Sand.js";
import useStore, { globalState } from "./store";
import BlocklyComponent from "./Blockly";
import prettier from "prettier";
import "./blocks/customblocks";
import "./generator/generator";
import { loadPostFromServer } from "./loadPostFromServer";
import { pallette } from "./Render";
import { ToolboxBlocks } from "./ToolboxBlocks";
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

if (typeof window !== "undefined") {
  if (!window?.location?.host?.includes("localhost")) {
    Sentry.init({
      dsn: "https://b2a3ffe2014947f5bb7c35db0eded196@o40136.ingest.sentry.io/6405403",
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1,
    });
  }
}

function generateCode(element, ws) {
  let baseBlock = undefined;
  for (let i = 0; i < ws.topBlocks_.length; i++) {
    const block = ws.topBlocks_[i];
    if (block.type == "sand_behavior_base") {
      baseBlock = block;
      break;
    }
  }
  try {
    let code = BlocklyJS.blockToCode(baseBlock);

    code = prettier.format(code, {
      parser: "babel",
      plugins: [parserBabel],
    });

    let xml = Xml.workspaceToDom(ws);
    let xmlText = Xml.domToPrettyText(xml);
    // eslint-disable-next-line no-new-func
    let fn = Function(code);
    useStore.getState().setXml(xmlText, element);
    globalState.updaters[element] = fn.bind(globalState);
  } catch (e) {
    console.error(e);
    return;
  }
}

const App = () => {
  let simpleWorkspace = useRef();
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelected = useStore((state) => state.setSelected);
  const [loaded, setLoaded] = useState(false);
  const [fetchedData, setFetchedData] = useState(false);

  // generate all the code on start
  useEffect(async () => {
    await loadPostFromServer();
    setFetchedData(true);
  }, []);
  // generate all the code on start
  useEffect(async () => {
    if (!fetchedData || !simpleWorkspace.current) {
      return;
    }
    let ws = simpleWorkspace.current.primaryWorkspace;
    globalState.workspace = ws;
    BlocklyJS.init(ws);

    for (let i = useStore.getState().elements.length - 1; i >= 0; i--) {
      setSelected(i);

      ws.clear();

      await new Promise((resolve) => {
        let cb = () => {
          generateCode(i, ws);
          ws.removeChangeListener(cb);
          resolve();
        };
        ws.addChangeListener(cb);
        let xml = useStore.getState().xmls[i];
        let dom = Xml.textToDom(xml);
        try {
          Xml.domToWorkspace(dom, ws);
        } catch (e) {
          console.error(e);
        }
      });
    }
    setSelected(useStore.getState().elements.length - 1);
    setLoaded(true);
    pallette();
  }, [simpleWorkspace, fetchedData]);

  useEffect(() => {
    if (simpleWorkspace.current && loaded) {
      let ws = simpleWorkspace.current.primaryWorkspace;
      globalState.workspace = ws;
      let cb = () => generateCode(selectedElement, ws);
      ws.addChangeListener(cb);
      return () => {
        ws.removeChangeListener(cb);
      };
    }
  }, [simpleWorkspace, selectedElement, loaded]);

  useEffect(() => {
    if (!simpleWorkspace.current || !loaded) return;
    simpleWorkspace.current.primaryWorkspace.clear();

    Xml.domToWorkspace(
      Xml.textToDom(
        useStore.getState().xmls[useStore.getState().selectedElement]
      ),
      simpleWorkspace.current.primaryWorkspace
    );
  }, [selectedElement, loaded]);

  let filter = ` brightness(1.0) contrast(0.1) saturate(0.1)`;
  if (loaded) {
    filter = "";
  }
  return (
    <div className="App">
      <BlocklyComponent
        style={{
          filter,
        }}
        ref={simpleWorkspace}
        collapse={false}
        comments={false}
        disable={false}
        maxBlocks={Infinity}
        readOnly={false}
        trashcan={false}
        media={"/media/"}
        renderer={"custom_renderer"}
        move={{
          scrollbars: true,
          drag: false,
          wheel: true,
        }}
        initialXml={starterXMLs[1]}
      >
        <ToolboxBlocks />
      </BlocklyComponent>
      <Sand />
    </div>
  );
};
export default App;
