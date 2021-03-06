/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import * as timeago from "timeago.js";

import "react-dropdown/style.css";
import { useQueryParams, StringParam } from "next-query-params";
import { useRouter } from "next/router";
import classNames from "classnames";

// import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import { imageURLBase } from "../ExtraUI";
import useStore, { globalState } from "../store";
import ElementButtons from "../ElementButtons";

export const BrowsePostLink = ({ post: initPost }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState(initPost);
  const selected = useStore((state) => state.postId === post.id);

  const href = `${window.location.protocol}//${window.location.host}/post/${post.id}`;
  const handleClick = (e) => {
    useStore.setState({
      postId: post.id,
    });
    e.preventDefault();
  };

  const handleEdit = (e) => {
    router.push(href);
    e.preventDefault();
  };
  const [query, setQuery] = useQueryParams({
    codeHash: StringParam,
    userId: StringParam,
  });

  let metadata = post.metadata;

  let displayTime = new Date(post.createdAt).toLocaleDateString();
  let msAgo = new Date().getTime() - new Date(post.createdAt).getTime();

  if (msAgo < 24 * 60 * 60 * 1000) {
    displayTime = timeago.format(post.createdAt);
  }

  return (
    <div
      className={classNames("post", {
        selected,
        placeholder: post.placeholder,
      })}
    >
      <a
        className="postThumbnail"
        href={href}
        style={{ fontSize: "1rem" }}
        onClick={handleClick}
      >
        {/* <span className="title">{post.title}</span> */}

        <img
          src={`${imageURLBase}${post.id}.gif`}
          width={300}
          height={300}
          onError={(e) => {
            if (e.target.src.endsWith("gif")) {
              e.target.src = `${imageURLBase}${post.id}.png`;
            }
          }}
        ></img>
      </a>

      <div className="browse-info">
        <button
          className="element-set-button"
          onClick={(e) => {
            e.preventDefault();
            setQuery({ codeHash: post.codeHash, userId: undefined });
          }}
        >
          {/* {post.codeHash.slice(0, 6)} */}
          <ElementButtons
            elements={metadata.elements}
            disabled={metadata.disabled}
            colors={metadata.colors}
            color2s={metadata.color2s}
            inert={true}
            selectedElement={-1}
          ></ElementButtons>
        </button>

        <div style={{ textAlign: "justify" }}>
          <button onClick={handleEdit}> Edit Code</button>
          <br></br>
          <button
            onClick={() => {
              fetch("/api/star/" + post.id)
                .then(function (response) {
                  return response.json();
                })
                .then(function (new_post) {
                  new_post.metadata = JSON.parse(new_post.metadata);
                  setPost(new_post);
                });
            }}
          >
            {(post.stars.length ? "???: " : "???: ") + post?._count?.stars ?? 0}
          </button>
          <br></br>
          {session?.role === "admin" && (
            <button
              onClick={async () => {
                const result = await axios("/api/update/" + post.id, {
                  params: { featured: true },
                });
                let results = result.data;
                results.metadata = JSON.parse(results.metadata);
                setPost(results);
              }}
            >
              Feature Post
            </button>
          )}
          <br></br>
          {displayTime}, {post.views} plays
          {/* <br></br> */}
          {/* Element Set:{"\t\t"} */}
          {"\t\t"}
          {/* <br></br> */}
          {post?.user?.image ? (
            <img
              className="pfp"
              onClick={(e) => {
                e.preventDefault();
                setQuery({ codeHash: undefined, userId: post.user.id });
              }}
              src={post?.user?.image}
            ></img>
          ) : (
            <>
              Author:{"\t\t"}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuery({ codeHash: undefined, userId: post.user.id });
                }}
              >
                {post?.user?.name ?? post?.user?.id.slice(0, 6)}
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>
        {`
          .post {
            background-color: rgba(250, 247, 247, 0.723);
            padding: 5px;
            margin-bottom: 6px;
            position: relative;
          }
          .selected {
            box-shadow: 0 0 0 4px black inset;
            background-color: rgba(250, 247, 247, 1);
          }

          .post.placeholder {
            filter: grayscale(100%) contrast(0.5);
          }
          .postThumbnail {
            width: 300px;
            height: 300px;
            margin-right: 3px;
          }
          .postThumbnail img {
            width: 300px;
            height: 300px;
            max-width: 50vw;
          }
          .browse-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-bottom: 2px;
            width: 400px;
            max-width: 50vw;
          }
          .element-set-button {
            flex-grow: 0;
            height: auto;
            text-align: start;
            padding: 0px;
          }
          .post .pfp {
            position: absolute;
            right: 0;
            bottom: 2px;
          }
        `}
      </style>
    </div>
  );
};

export default BrowsePostLink;
