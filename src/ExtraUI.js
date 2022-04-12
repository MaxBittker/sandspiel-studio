import React, { useState } from "react";
import { seed } from "./SandApi";
import { UPDATE_SCHEMES } from "./updateSchemes";
const UpdateSchemeButton = ({ name, setUpdateScheme, selected }) => {
  return (
    <button
      className={`simulation-button update-scheme-button${
        selected ? " selected" : ""
      }`}
      onClick={() => setUpdateScheme(name)}
    >
      {name}
    </button>
  );
};
const TaggedModeCheckbox = ({ setTaggedMode, selected }) => {
  return (
    <input
      id="taggedModeCheckbox"
      type="checkbox"
      checked={selected}
      onChange={() => setTaggedMode(!selected)}
    ></input>
  );
};
const ExtraUI = ({
  updateScheme,
  setUpdateScheme,
  taggedMode,
  setTaggedMode,
}) => {
  let [copiedState, setCopiedState] = useState(null);
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
      <details>
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
      </details>
      <div>
        <button
          className="simulation-button"
          onClick={() => {
            let json = JSON.stringify(window.xmls, null, " ");

            var data = [
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
      </div>
    </div>
  );
};
export default ExtraUI;
