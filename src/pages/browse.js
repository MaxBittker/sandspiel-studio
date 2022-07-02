/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import { useSession } from "next-auth/react";
import * as timeago from "timeago.js";
import Link from "next/link";
import CreateReactAppEntryPoint from "../App";

import "react-dropdown/style.css";
import {
  useQueryParams,
  StringParam,
  withDefault,
  BooleanParam,
} from "next-query-params";
import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import Home from "../Auth";
import axios from "axios";
import { imageURLBase } from "../ExtraUI";
import useStore, { globalState } from "../store";

import ElementButtons from "../ElementButtons";

// const ago = timeago();
const placeholder = {
  id: 0,
  placeholder: true,
  metadata: {
    elements: ["a", "b", "c"],
    disabled: [],
    colors: ["red", "green", "blue"],
    color2s: ["red", "green", "blue"],
  },
  stars: [],
};
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
    featured: BooleanParam,
  });

  const [data, setData] = useState([
    { ...placeholder, id: 1 },
    { ...placeholder, id: 2 },
    { ...placeholder, id: 3 },
    { ...placeholder, id: 4 },
  ]);
  // const postId = useStore((state) => state.postId);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/query", { params: query });

      let results = result.data;
      results = results.map((r) => {
        r.metadata = JSON.parse(r.metadata);
        return r;
      });

      setData(results);
    };

    fetchData();
  }, [
    query.order,
    query.userId,
    query.codeHash,
    query.starredBy,
    query.featured,
    query.days,
  ]);

  console.log(data);
  return (
    <div className="browse-page">
      <div className="browse family">
        <Link href={`/`}>Editor</Link>

        {/* <div style={{ float: "right" }}>
          <Home />
        </div> */}
        {session && (
          <span className="filterControls">
            <button
              className={query.featured === true ? "selected" : ""}
              onClick={(e) => {
                e.preventDefault();
                setQuery({
                  codeHash: undefined,
                  userId: undefined,
                  starredBy: undefined,
                  featured: true,
                });
              }}
            >
              {" "}
              Featured
            </button>
            <button
              className={query.userId === session.userId ? "selected" : ""}
              onClick={(e) => {
                e.preventDefault();
                setQuery({
                  codeHash: undefined,
                  userId: session.userId,
                  starredBy: undefined,
                  featured: undefined,
                });
              }}
            >
              {" "}
              Mine
            </button>
            <button
              className={query.starredBy === session.userId ? "selected" : ""}
              onClick={(e) => {
                e.preventDefault();
                setQuery({
                  codeHash: undefined,
                  userId: undefined,
                  featured: undefined,

                  starredBy: session.userId,
                });
              }}
            >
              {" "}
              Favorited
            </button>

            <button
              className={
                query.starredBy !== session.userId &&
                !query.userId &&
                !query.featured
                  ? "selected"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                setQuery({
                  codeHash: undefined,
                  userId: undefined,
                  starredBy: undefined,
                  featured: undefined,
                });
              }}
            >
              {" "}
              All
            </button>
          </span>
        )}
        <span className="filterControls">
          <Dropdown
            options={options}
            onChange={(e) => {
              if (e.value === "top") {
                setQuery({ order: e.value, days: "365" });
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

      <CreateReactAppEntryPoint playMode />
    </div>
  );
}

const BrowsePostLink = ({ post: initPost }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState(initPost);
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
    <div className={"post " + (post.placeholder ? " placeholder" : "")}>
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
          <button onClick={handleEdit}> edit code</button>
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
            {(post.stars.length ? "★: " : "☆: ") + post?._count?.stars ?? 0}
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
    </div>
  );
};

export default Browse;
