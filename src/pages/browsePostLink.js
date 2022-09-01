/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import * as timeago from "timeago.js";

import "react-dropdown/style.css";
import { useQueryParams, StringParam, BooleanParam, withDefault } from "next-query-params";
import { useRouter } from "next/router";
import classNames from "classnames";

// import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import { imageURLBase } from "../simulation-controls/ExtraUI";
import useStore, { globalState } from "../store";
import ElementButtons from "../simulation-controls/ElementButtons";

export const BrowsePostLink = ({ post: initPost }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState(initPost);
  const selected = useStore((state) => state.postId === post.id);

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
    featured: BooleanParam,
    admin: withDefault(BooleanParam, true),
  });

  let metadata = post.metadata;

  let displayTime = new Date(post.createdAt).toLocaleDateString();
  let msAgo = new Date().getTime() - new Date(post.createdAt).getTime();

  if (msAgo < 24 * 60 * 60 * 1000) {
    displayTime = timeago.format(post.createdAt);
  }

  let [adminFeaturingStatus, setAdminFeaturingStatus] = useState(null);
  let [adminPublishingStatus, setAdminPublishingStatus] = useState(null);

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
        {/*<button
          className="element-set-button"
          onClick={(e) => {
            e.preventDefault();
            setQuery({ codeHash: post.codeHash, userId: undefined });
          }}
        >
          <ElementButtons
            elements={metadata.elements}
            disabled={metadata.disabled}
            colors={metadata.colors}
            color2s={metadata.color2s}
            inert={true}
            selectedElement={-1}
          ></ElementButtons>
        </button>*/}
        
        {displayTime}, {post.views} plays

        <div className="title-container">
          <div className="title">{post.title}</div>
        </div>

        <div style={{ textAlign: "justify" }}>
          {/*<button onClick={handleEdit}> Edit Code</button>*/}
          <br></br>
          <button
            onClick={() => {
              setStarsOverride(stars + 1 * (isStarred ? -1 : 1));
              setIsStarredOverride(!isStarred);
              fetch("/api/star/" + post.id)
                .then(function (response) {
                  return response.json();
                })
                .then(function (new_post) {
                  new_post.metadata = JSON.parse(new_post.metadata);
                  setPost(new_post);

                  setIsStarredOverride(null);
                  setStarsOverride(null);
                });
            }}
          >
            {(isStarred ? "★: " : "☆: ") + stars}
          </button>
          <span className="featured-flag">
            {post.featuredAt ? "🏆FEATURED" : ""}
          </span>
          <br></br>
          {session?.role === "admin" && query.admin && (
            <div>
              Admin:&nbsp;
              <button
                onClick={async () => {
                  setAdminFeaturingStatus(" ...");
                  const result = await axios("/api/update/" + post.id, {
                    params: { featured: !post.featuredAt },
                  });
                  let results = result.data;
                  results.metadata = JSON.parse(results.metadata);
                  setPost(results);
                  setAdminFeaturingStatus("");
                }}
              >
                {post.featuredAt ? "Unfeature Post" : "Feature Post"}
                {adminFeaturingStatus}
              </button>
              <button
                onClick={async () => {
                  setAdminPublishingStatus(" ...");
                  const result = await axios("/api/update/" + post.id, {
                    params: { public: !post.public },
                  });
                  let results = result.data;
                  results.metadata = JSON.parse(results.metadata);
                  setPost(results);
                  setAdminPublishingStatus("");
                }}
              >
                {post.public === true ? "Make Private" : "Make Public"}
                {adminPublishingStatus}
              </button>
            </div>
          )}
          {/* <br></br> */}
          {/* Element Set:{"\t\t"} */}
          {"\t\t"}
          {/* <br></br> */}
          {post?.user?.image ? (
            <img
              className="pfp"
              onClick={(e) => {
                e.preventDefault();
                setQuery({
                  codeHash: undefined,
                  userId: post.user.id,
                  featured: false,
                });
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
            max-width: calc(50vw - 6px - 10px);
            max-height: calc(50vw - 6px - 10px);
          }
          .postThumbnail img {
            width: 100%;
            height: 100%;
          }
          .browse-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-bottom: 2px;
            width: 400px;
            max-width: calc(50vw - 5px);
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
