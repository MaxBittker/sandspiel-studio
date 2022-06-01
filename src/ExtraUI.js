import React, { useState } from "react";
import { encode } from "fast-png";

import { seed, width, height, sands, tick } from "./SandApi";
import { snapshot } from "./Render";
import { useStore } from "./store";
import * as vkbeautify from "vkbeautify";
import { base64ArrayBuffer } from "./base64ArrayBuffer";
import PlayPause from "./PlayPauseButton";
import Family from "./Family";
import SizeButtons from "./SizeButtons";
import Home from "./Auth";
export const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

function prepareXMLs() {
  let regex = /id="([^\\]*?)"/g;
  let minifiedXmls = useStore
    .getState()
    .xmls.map((x) => vkbeautify.xmlmin(x).replaceAll(regex, ""));
  return minifiedXmls;
}

function prepareExport() {
  let minifiedXmls = prepareXMLs();
  let json = JSON.stringify(minifiedXmls, null, " ");
  return json;
}

const ExtraUI = ({}) => {
  let [id, setId] = useState(null);
  let [title, setTitle] = useState("");
  let [copiedState, setCopiedState] = useState(null);
  let [sharedState, setSharedState] = useState(null);
  const paused = useStore((state) => state.paused);

  const pos = useStore((state) => state.pos);
  const elements = useStore((state) => state.elements);
  let index = (pos[0] + pos[1] * width) * 4;
  let t = sands[index];
  let g = sands[index + 1];
  let b = sands[index + 2];
  let a = sands[index + 3];

  let mobile = false;
  if (window.innerWidth < 900) {
    mobile = true;
  }

  return (
    <div className="extras-tray">
      <div className="first-row">
        <span>
          <PlayPause />
          {paused && (
            <button
              className="simulation-button"
              onClick={() => {
                tick();
              }}
            >
              Step
            </button>
          )}
        </span>
        {!mobile && (
          <pre style={{ width: 120 }}>
            {t !== undefined &&
              `${elements[t]}\n${g} Color Fade\n${b} Hue Rotate\n${a} Extra`}
          </pre>
        )}
        <SizeButtons />
      </div>

      <button
        className="simulation-button"
        onClick={() => {
          seed();
        }}
      >
        Reset
      </button>
      <br></br>
      <br></br>
      <div>
        <input
          type="text"
          placeholder="creation title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="simulation-button"
          onClick={() => {
            let xmls = prepareXMLs();
            let thumbnail = snapshot();
            let id = window.location.pathname.slice(6);

            let buffer = encode({
              width,
              height,
              data: sands,
            });
            let data = "data:image/png;base64," + base64ArrayBuffer(buffer);

            setSharedState(" ...");

            fetch("/api/upload", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                parentId: id,
                title,
                code: JSON.stringify(
                  {
                    paused: useStore.getState().paused,
                    size: useStore.getState().size,
                    selectedElement: useStore.getState().selectedElement,
                    disabled: useStore.getState().disabled,
                    xmls: xmls,
                  },
                  null,
                  " "
                ),
                thumbnail,
                data,
              }),
            })
              .then(function (response) {
                return response.json();
              })
              .then(function ({ id }) {
                window.history.pushState({}, "sand blocks", "/post/" + id);
                setId(id);

                var data = [
                  // eslint-disable-next-line no-undef
                  new ClipboardItem({
                    "text/plain": new Blob([window.location.href], {
                      type: "text/plain",
                    }),
                  }),
                ];
                navigator.clipboard.write(data).then(
                  function () {
                    setSharedState(" ✓ Copied");
                  },
                  function () {
                    setSharedState("...Error");
                  }
                );
              });
          }}
        >
          Share {sharedState}
        </button>
        {sharedState === " ✓ Copied" && (
          <>
            <pre style={{ fontSize: "1rem", color: "blue" }}>
              {window.location.href}
            </pre>
            export <img src={`${imageURLBase}${id}.png`}></img>
          </>
        )}
        <br />
        <br />
        <br />
        <br />
        {window.location.host.includes("localhost") && (
          <button
            className="simulation-button"
            onClick={() => {
              let json = prepareExport();

              var data = [
                // eslint-disable-next-line no-undef
                new ClipboardItem({
                  "text/plain": new Blob([json], { type: "text/plain" }),
                }),
              ];
              navigator.clipboard
                .write(data)
                .then(
                  function () {
                    setCopiedState(" ✓");
                  },
                  function () {
                    setCopiedState("...Error");
                  }
                )
                .finally(() => {
                  window.setTimeout(() => {
                    setCopiedState(null);
                  }, 3000);
                });
            }}
          >
            Export to Clipboard {copiedState}
          </button>
        )}
        <Family />
        <Home />

        <img className="wordmark" src="/sandspiel.png"></img>
      </div>
    </div>
  );
};
export default ExtraUI;
