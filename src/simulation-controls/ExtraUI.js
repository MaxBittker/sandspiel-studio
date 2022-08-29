import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQueryParams, withDefault, BooleanParam } from "next-query-params";

import {
  seed,
  reset,
  width,
  height,
  sands,
  tick,
  popUndo,
  addBorder,
} from "../simulation/SandApi";
import { useStore } from "../store";
import * as vkbeautify from "vkbeautify";
import PlayPause from "./PlayPauseButton";
import SizeButtons from "./SizeButtons";
import WorldSizeButtons from "./WorldSizeButtons";
import Home from "../Auth";
import UploadButtons from "./UploadButtons";
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

const ExtraUI = () => {
  const [query, setQuery] = useQueryParams({
    edit: withDefault(BooleanParam, false),
  });
  const playMode = !query.edit;

  const { data: session } = useSession();

  let [copiedState, setCopiedState] = useState(null);
  const post = useStore((state) => state.post);

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

  let stars = post?._count?.stars;
  const [starsOverride, setStarsOverride] = useState(null);

  if (starsOverride !== null) {
    stars = starsOverride;
  }

  let isStarred = session?.userId && post?.stars?.length > 0;
  const [isStarredOverride, setIsStarredOverride] = useState(null);

  if (isStarredOverride !== null) {
    isStarred = isStarredOverride;
  }

  return (
    <div className="extras-tray">
      <div className="first-row">
        <div>
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

          <div>
            <button
              className="simulation-button"
              onClick={() => {
                popUndo();
              }}
            >
              Undo
            </button>
          </div>

          <div>
            <button
              className="simulation-button"
              onClick={() => {
                seed();
                addBorder();
              }}
            >
              Clear
            </button>
          </div>
        </div>
        {!mobile && (
          <pre style={{ width: 120, height: "1em" }}>
            {t !== undefined &&
              `${elements[t]}\n${g} Color Fade\n${b} Hue Rotate\n${a} Extra`}
          </pre>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <SizeButtons />
          <pre style={{ marginTop: "30px" }}>World Size</pre>
          <WorldSizeButtons />
        </div>
      </div>

      {/* <button
        className="simulation-button"
        onClick={() => {
          addBorder();
        }}
      >
        Add Border
      </button> */}
      <br />
      <div>
        <UploadButtons />

        {/*!playMode && post?.views && "views: " + post.views*/}

        {/*!playMode && stars !== undefined && (
          <button
            style={{ marginTop: "5px" }}
            onClick={() => {
              setStarsOverride(stars + 1 * (isStarred ? -1 : 1));
              setIsStarredOverride(!isStarred);
              fetch("/api/star/" + post.id)
                .then(function (response) {
                  return response.json();
                })
                .then(function (post) {
                  //console.log(post);

                  useStore.setState({
                    post,
                  });

                  setIsStarredOverride(null);
                  setStarsOverride(null);
                });
            }}
          >
            {(isStarred ? "★: " : "☆: ") + stars}
          </button>
        )*/}
        {/*post ? (
          <button
            className="simulation-button"
            onClick={() => {
              reset();
            }}
          >
            Reload world
          </button>
        ) : (
          ""
        )*/}
        {/*session && post?.user?.id == session.userId && (
          <button
            onClick={() => {
              fetch("/api/updateProfile/", {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  postId: post.id,
                }),
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (post) {
                  console.log(post);

                  useStore.setState({
                    post,
                  });
                });
            }}
          >
            Set this post as my avatar
          </button>
        )*/}
        <br />
        <button
          className="editor-toggle"
          onClick={(e) => {
            setQuery({ edit: playMode });
          }}
        >
          {playMode ? "Open Editor ➡" : "⬅ Close Editor"}
        </button>

        <Home />

        {/*!playMode && window.location.host.includes("localhost") && (
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
          )*/}

        <img className="wordmark" src="/sandspiel.png"></img>
      </div>
    </div>
  );
};
export default ExtraUI;
