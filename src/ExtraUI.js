import React, { useCallback, useEffect, useState } from "react";
import { encode } from "fast-png";
import { useSession } from "next-auth/react";
import Link from "next/link";

import {
  seed,
  reset,
  width,
  height,
  sands,
  tick,
  popUndo,
  addBorder,
} from "./SandApi";
import { snapshot, exportGif } from "./Render";
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

const ExtraUI = () => {
  const { data: session } = useSession();

  let [id, setId] = useState(null);
  let [title, setTitle] = useState("");
  let [postPublic, setPublic] = useState(false);
  let [copiedState, setCopiedState] = useState(null);
  let [sharedState, setSharedState] = useState(null);
  const post = useStore((state) => state.post);
  useEffect(() => {
    if (post?.title) {
      setTitle(post.title);
    }
  }, [post]);
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
  let upload = useCallback(
    async (postPublic = false) => {
      if (postPublic && !session) {
        setSharedState("Sign in to post publicly");
        window.setTimeout(() => {
          setSharedState("");
        }, 3000);
        return;
      }
      if (sharedState === " ...") return;
      let xmls = prepareXMLs();
      let thumbnail = snapshot();
      let gif = await exportGif();
      let id = window.location.pathname.slice(6);

      let buffer = encode({
        width,
        height,
        data: sands,
      });
      let data = "data:image/png;base64," + base64ArrayBuffer(buffer);

      useStore.setState({ initialSandsData: new Uint8Array(sands) });

      setSharedState(" ...");

      fetch("/api/upload", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: id,
          public: postPublic,
          title,
          metadata: JSON.stringify(
            {
              paused: useStore.getState().paused,
              disabled: useStore.getState().disabled,
              elements: useStore.getState().elements,
              colors: useStore.getState().colors,
              color2s: useStore.getState().color2s,
              size: useStore.getState().size,
              selectedElement: useStore.getState().selectedElement,
            },
            null,
            " "
          ),
          code: JSON.stringify(
            {
              xmls: xmls,
            },
            null,
            " "
          ),
          thumbnail,
          gif,
          data,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (post) {
          console.log(post);
          window.history.pushState({}, "sand blocks", "/post/" + post.id);
          setId(post.id);

          useStore.setState({
            post,
          });

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
            function (e) {
              console.error(e);
              setSharedState("...Error");
            }
          );
        })
        .finally(() => {
          window.setTimeout(() => {
            setSharedState("");
          }, 3000);
        });
    },
    [title, postPublic, post?._count?.stars, session]
  );
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
          <pre style={{ width: 120, height: "1em" }}>
            {t !== undefined &&
              `${elements[t]}\n${g} Color Fade\n${b} Hue Rotate\n${a} Extra`}
          </pre>
        )}
        <SizeButtons />
      </div>
      <button
        className="simulation-button"
        onClick={() => {
          popUndo();
        }}
      >
        Undo
      </button>
      <div>
        <button
          className="simulation-button"
          onClick={() => {
            reset();
          }}
        >
          Reset
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
        {/* <input
          type="text"
          placeholder="creation title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /> */}

        <button className="simulation-button" onClick={() => upload(false)}>
          Save
        </button>
        <button className="simulation-button" onClick={() => upload(true)}>
          Post ↑
        </button>

        {sharedState ?? ""}
        <br />
        {post?.views && "views: " + post.views}
        <br />

        {stars !== undefined && (
          <button
            onClick={() => {
              fetch("/api/star/" + post.id)
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
            {"☆: " + stars}
          </button>
        )}
        <br />
        {session && post?.user?.id == session.userId && (
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
        )}
        <br />
        <Link href={`/browse`}>Browse</Link>
        <Home />

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

        <img className="wordmark" src="/sandspiel.png"></img>
      </div>
    </div>
  );
};
export default ExtraUI;
