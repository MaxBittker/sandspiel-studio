import React, { useCallback, useEffect, useState } from "react";
import { encode } from "fast-png";
import axios from "axios";
import { useSession } from "next-auth/react";

import { width, height, sands, reset } from "./SandApi";
import { snapshot, exportGif } from "./Render";
import { useStore } from "./store";
import * as vkbeautify from "vkbeautify";

export const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

function prepareXMLs() {
  let regex = /id="([^\\]*?)"/g;
  let minifiedXmls = useStore
    .getState()
    .xmls.map((x) => vkbeautify.xmlmin(x).replaceAll(regex, ""));
  return minifiedXmls;
}

const UploadButtons = () => {
  const { data: session } = useSession();

  // let [id, setId] = useState(null);
  let [title, setTitle] = useState("");
  let [sharedState, setSharedState] = useState(null);
  const post = useStore((state) => state.post);
  useEffect(() => {
    if (post?.title) {
      setTitle(post.title);
    }
  }, [post]);

  let upload = useCallback(
    async (postPublic = false) => {
      if (
        sharedState === " saving..." ||
        sharedState === " posting..." ||
        sharedState === " ✓ posted" ||
        sharedState === " ✓ saved"
      ) {
        return;
      }
      setSharedState(" preparing...");
      if (postPublic && !session) {
        setSharedState("Sign in to post publicly");
        window.setTimeout(() => {
          setSharedState("");
        }, 3000);
        return;
      }
      function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(",")[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: "image/png" });
      }
      let xmls = prepareXMLs();
      let thumbnail = dataURItoBlob(snapshot());
      let gif = await exportGif();
      let id = useStore.getState().postId;

      let buffer = encode({
        width,
        height,
        data: sands,
      });
      let data = new Blob([buffer]); //= "data:image/png;base64," + base64ArrayBuffer(buffer);

      useStore.setState({ initialSandsData: new Uint8Array(sands) });

      setSharedState(postPublic ? " posting..." : " saving...");

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
              worldScale: useStore.getState().worldScale,
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
          // thumbnail,
          // gif,
          // data,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(async function (post) {
          function uploadFile(url, type, blob) {
            return axios.put(url, blob, {
              headers: { "Content-Type": type },
            });
          }

          let { dataUploadUrl, thumbUploadUrl, gifUploadUrl } = post;
          await Promise.all([
            uploadFile(dataUploadUrl, "image/png", data),
            uploadFile(thumbUploadUrl, "image/png", thumbnail),
            uploadFile(gifUploadUrl, "image/gif", gif),
          ]);

          return post;
        })
        .then(function (post) {
          console.log(post);
          window.history.pushState({}, "sand blocks", "/post/" + post.id);
          // setId(post.id);

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
              setSharedState(postPublic ? " ✓ posted" : " ✓ saved");
            },
            function (e) {
              console.error(e);
              setSharedState("... error");
            }
          );
        })
        .finally(() => {
          window.setTimeout(() => {
            setSharedState("");
          }, 3000);
        });
    },
    [title, post?._count?.stars, session]
  );
  return (
    <>
      <button className="simulation-button" onClick={() => upload(false)}>
        Save
      </button>
      <button className="simulation-button" onClick={() => upload(true)}>
        Post ↑
      </button>
      <span>{sharedState ?? ""}</span>
    </>
  );
};
export default UploadButtons;
