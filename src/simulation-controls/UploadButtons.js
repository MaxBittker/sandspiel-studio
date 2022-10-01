import React, { useCallback, useEffect, useState } from "react";
import { encode } from "fast-png";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router.js";

import {
  useQueryParams,
  StringParam,
  withDefault,
  BooleanParam,
  NumberParam,
} from "next-query-params";

import { width, height, sands, reset } from "../simulation/SandApi";
import { snapshot, exportGif } from "../simulation/Render";
import { useStore } from "../store";
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

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/png" });
}

const UploadButtons = () => {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(false);
  const [query, setQuery] = useQueryParams({
    codeHash: StringParam,
    userId: StringParam,
    starredBy: StringParam,
    order: withDefault(StringParam, "new"),
    days: StringParam,
    featured: withDefault(BooleanParam, true),
    edit: withDefault(BooleanParam, false),
    id: NumberParam,
    admin: BooleanParam,
  });

  const persistingQuery = {};
  if (query.admin !== undefined) {
    persistingQuery.admin = query.admin;
  }

  const { data: session } = useSession();

  // let [id, setId] = useState(null);
  let [title, setTitle] = useState("");
  let [sharedState, setSharedState] = useState(null);

  const post = useStore((state) => state.post);
  useEffect(() => {
    setTitle("");
  }, [post]);

  let upload = async (postPublic = false) => {
    if (
      sharedState === " saving..." ||
      sharedState === " posting..." ||
      sharedState === " ✓ posted" ||
      sharedState === " ✓ saved"
    ) {
      return;
    }
    setSharedState(" preparing...");
    if (!session) {
      setSharedState("Please sign in to save & post :)");
      window.setTimeout(() => {
        setSharedState("");
      }, 3000);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 35));

    let xmls = prepareXMLs();
    let thumbnail = dataURItoBlob(snapshot());
    let gif = await exportGif();

    let id = useStore.getState().postId;
    console.log(id);

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
        // public: postPublic, // we set this after the upload
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

        const result = await axios("/api/update/" + post.id, {
          params: { public: postPublic },
        });

        return result.data;
      })
      .then(function (post) {
        //console.log(post);
        //window.history.pushState({}, "sand blocks", "/?id=" + post.id);
        // setId(post.id);

        useStore.setState({
          post,
          postId: post.id,
        });

        try {
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
              router.push({
                pathname: `/post/${post.id}`,
                query: persistingQuery,
              });
              /*setQuery({
                codeHash: undefined,
                userId: undefined,
                starredBy: undefined,
                featured: undefined,
                edit: undefined,
                id: post.id,
              });*/
            },
            function (e) {
              console.error(e);
              setSharedState("... error");
            }
          );
        } catch (e) {
          // Avoided a crash in Firefox
          // TODO: fix this
          setSharedState(postPublic ? " ✓ posted" : " ✓ saved");
          router.push({
            pathname: `/post/${post.id}`,
            query: persistingQuery,
          });
          /*setQuery({
            codeHash: undefined,
            userId: undefined,
            starredBy: undefined,
            featured: undefined,
            edit: undefined,
            id: post.id,
          });*/
        }
      })
      .finally(() => {
        window.setTimeout(() => {
          setSharedState("");
        }, 3000);
      });
  };
  return (
    <>
      <input
        type="text"
        placeholder={post ? "reply title..." : "post title..."}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* <button className="simulation-button" onClick={() => upload(false)}>
        Save
      </button> */}
      <button
        className="simulation-button postButton"
        onClick={() => upload(isPublic)}
      >
        {isPublic ? "Post ↑" : post ? "Reply ↑" : "Save  ↑"}
      </button>
      <br></br>
      <label>Public:</label>
      <input
        type="checkbox"
        checked={isPublic}
        onChange={(e) => setIsPublic(!isPublic)}
      />
      <span>{sharedState ?? ""}</span>
    </>
  );
};
export default UploadButtons;
