/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import { useSession } from "next-auth/react";
import * as timeago from "timeago.js";

import "react-dropdown/style.css";
import { useQueryParams, StringParam, withDefault } from "next-query-params";
import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import Home from "../Auth";
import axios from "axios";
import { imageURLBase } from "../ExtraUI";

import ElementButtons from "../ElementButtons";

// const ago = timeago();

const options = ["new", "top"];
const optionsTime = [
  { value: "1", label: "day" },
  { value: "7", label: "week" },
  { value: "30", label: "month" },
  { value: "365", label: "year" },
];

function Browse() {
  const router = useRouter();
  const { data: session } = useSession();

  const [query, setQuery] = useQueryParams({
    codeHash: StringParam,
    userId: StringParam,
    starredBy: StringParam,
    order: withDefault(StringParam, "new"),
    days: StringParam,
  });

  const [data, setData] = useState([]);
  //   const [timeFrame, setTimeFrame] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/query", { params: query });

      console.log(result);
      setData(result.data);
    };

    fetchData();
  }, [query.order, query.userId, query.codeHash, query.days]);

  console.log(data);
  return (
    <div className="browse family">
      <div style={{ position: "absolute", right: 40 }}>
        <Home />
      </div>
      {session && (
        <span className="filterControls">
          <button
            className={query.userId === session.userId ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setQuery({
                codeHash: undefined,
                userId: session.userId,
                starredBy: undefined,
              });
            }}
          >
            {" "}
            my posts
          </button>
          <button
            className={query.starredBy === session.userId ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setQuery({
                codeHash: undefined,
                userId: undefined,
                starredBy: session.userId,
              });
            }}
          >
            {" "}
            my favorites
          </button>
          <button
            className={""}
            onClick={(e) => {
              e.preventDefault();
              setQuery({
                codeHash: undefined,
                userId: undefined,
                starredBy: undefined,
              });
            }}
          >
            {" "}
            clear
          </button>
        </span>
      )}
      <span className="filterControls">
        <Dropdown
          options={options}
          onChange={(e) => {
            if (e.value === "top") {
              setQuery({ order: e.value, days: "7" });
            } else {
              setQuery({ order: e.value });
            }
          }}
          value={query.order}
        />
        {query.order === "top" && (
          <Dropdown
            options={optionsTime}
            onChange={(e) => setQuery({ days: e.value })}
            value={query.days}
          />
        )}
      </span>
      {data.map((d) => {
        return <BrowsePostLink key={d.id} post={d} full />;
      })}
    </div>
  );
}

const BrowsePostLink = ({ post }) => {
  const router = useRouter();
  const href = `${window.location.protocol}//${window.location.host}/post/${post.id}`;
  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  const [query, setQuery] = useQueryParams({
    codeHash: StringParam,
    userId: StringParam,
  });

  post.stars = post?._count?.stars ?? 0;
  let metadata = JSON.parse(post.metadata);

  let displayTime = new Date(post.createdAt).toLocaleDateString();
  let msAgo = new Date().getTime() - new Date(post.createdAt).getTime();

  if (msAgo < 24 * 60 * 60 * 1000) {
    displayTime = timeago.format(post.createdAt);
  }

  return (
    <div className="post">
      <a
        className="postThumbnail"
        href={href}
        style={{ fontSize: "1rem" }}
        onClick={handleClick}
      >
        {/* <span className="title">{post.title}</span> */}

        <img
          src={`${imageURLBase}${post.id}.gif`}
          onError={(e) => (e.target.src = `${imageURLBase}${post.id}.png`)}
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
          {displayTime}, {post.views} plays
          <br></br>
          <button
            onClick={() => {
              fetch("/api/star/" + post.id)
                .then(function (response) {
                  return response.json();
                })
                .then(function (new_post) {
                  //todo this doesn't work
                  post._count = new_post._count;
                  post.stars = new_post?._count?.stars ?? 0;
                });
            }}
          >
            {"☆: " + post.stars}
          </button>
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
    </div>
  );
};

export default Browse;
