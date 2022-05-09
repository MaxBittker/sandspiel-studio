import React, { useState } from "react";
import { seed, width, height, sands } from "./SandApi";
import { snapshot } from "./Render";
import { useStore } from "./store";
// import { UPDATE_SCHEMES } from "./updateSchemes";
import * as vkbeautify from "vkbeautify";
const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

function prepareExport() {
  let regex = /id="([^\\]*?)"/g;
  let minifiedXmls = useStore
    .getState()
    .xmls.map((x) => vkbeautify.xmlmin(x).replaceAll(regex, ""));
  let json = JSON.stringify(minifiedXmls, null, " ");
  return json;
}
const ExtraUI = ({
  updateScheme,
  setUpdateScheme,
  taggedMode,
  setTaggedMode,
}) => {
  let [id, setId] = useState(null);
  let [copiedState, setCopiedState] = useState(null);
  let [sharedState, setSharedState] = useState(null);

  return (
    <div className="extras-tray">
      <button
        className="simulation-button"
        onClick={() => {
          seed();
        }}
      >
        Reset
      </button>

      <div>
        <button
          className="simulation-button"
          onClick={() => {
            let json = prepareExport();
            let thumbnail = snapshot();

            let dataCanvas = document.createElement("canvas");
            let context = dataCanvas.getContext("2d");
            dataCanvas.height = height;
            dataCanvas.width = width;

            const pixels = new Uint8ClampedArray(sands);
            const imageData = new ImageData(pixels, width, height);

            context.putImageData(imageData, 0, 0);
            let data = dataCanvas.toDataURL("image/png");

            fetch("api/upload", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: json,
                thumbnail,
                data,
              }),
            })
              .then(function (response) {
                return response.json();
              })
              .then(function ({ id }) {
                window.history.pushState({}, "sand blocks", "?" + id);
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
          Get Share Link {sharedState}
        </button>
        {sharedState === " ✓ Copied" && (
          <>
            <pre style={{ fontSize: "1rem", color: "blue" }}>
              {window.location.href}
            </pre>
            <img src={`${imageURLBase}${id}.png`}></img>
          </>
        )}
        <br />
        <br />
        <br />
        <br />
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
        {/* <details>
          <summary>Update Order</summary>
          <div className="update-scheme-tray">
            {Object.keys(UPDATE_SCHEMES).map((key) => {
              return (
                <UpdateSchemeButton
                  key={key}
                  setUpdateScheme={setUpdateScheme}
                  name={key}
                  selected={key === updateScheme}
                />
              );
            })}
            <div className="tagged-mode-tray">
              <TaggedModeCheckbox
                setTaggedMode={setTaggedMode}
                selected={taggedMode}
              ></TaggedModeCheckbox>
              <label htmlFor="taggedModeCheckbox">TAGGED</label>
            </div>
          </div>
        </details> */}
        <img className="wordmark" src="sandspiel.png"></img>
      </div>
    </div>
  );
};
export default ExtraUI;
