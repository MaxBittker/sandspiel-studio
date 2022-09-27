import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQueryParams, withDefault, BooleanParam } from "next-query-params";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [query, setQuery] = useQueryParams({
    edit: withDefault(BooleanParam, false),
    admin: withDefault(BooleanParam, true),
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
  if (window.innerWidth <= 700) {
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
      <div className="controls-row">
        <span>
          <PlayPause />
          <button
            className="simulation-button"
            onClick={() => {
              popUndo();
            }}
          >
            Undo
          </button>

          <button
            className="simulation-button"
            onClick={() => {
              seed();
              addBorder();
            }}
          >
            Clear
          </button>
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
        <SizeButtons />
      </div>

      <div className="controls-row">
        {!mobile && (
          <pre style={{ width: 120, height: "1em" }}>
            {t !== undefined &&
              `${elements[t]}\n${g} Color Fade\n${b} Hue Rotate\n${a} Extra`}
          </pre>
        )}
        <WorldSizeButtons />
      </div>

      {/* <button
        className="simulation-button"
        onClick={() => {
          addBorder();
        }}
      >
        Add Border
      </button> */}
      {session ? (
        <div>
          {post && (
            <div>
              Replying to{" "}
              <a
                onClick={() => {
                  router.push({
                    pathname: `/post/${post.id}`,
                  });
                }}
              >
                {post?.user?.name ?? post?.user?.id?.slice(0, 8)}'s post
              </a>
            </div>
          )}
          {session && <UploadButtons />}

          {/*post ? (
            <button
              className="simulation-button"
              onClick={() => {
                reset();
              }}
            >
              Restart
            </button>
          ) : (
            ""
          )*/}

          {!playMode &&
            query.admin &&
            window.location.host.includes("localhost") && (
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
        </div>
      ) : (
        ""
      )}

      <img className="wordmark" src="/sandspiel.png"></img>
    </div>
  );
};
export default ExtraUI;
