import { UPDATE_SCHEMES, seed } from "./Sand.js";
import { downloadElements } from "./App";

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
  setTaggedMode
}) => {
  return (
    <div className="extras-tray">
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

      <button
        className="simulation-button"
        onClick={() => {
          seed();
        }}
      >
        Reset
      </button>

      <button
        className="simulation-button"
        onClick={() => {
          downloadElements();
        }}
      >
        Export
      </button>
      {/* <textarea>{blocksAsJson()}</textarea> */}
    </div>
  );
};
export default ExtraUI;
