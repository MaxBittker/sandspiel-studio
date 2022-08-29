/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

// import { ReactQueryDevtools } from "react-query/devtools";
import Dropdown from "react-dropdown";
import { useSession } from "next-auth/react";
import Link from "next/link";

import "react-dropdown/style.css";
import {
  useQueryParams,
  StringParam,
  withDefault,
  BooleanParam,
} from "next-query-params";
import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import CreateReactAppEntryPoint from "../App";
import BrowsePostLink from "./browsePostLink";
import Spinner from "./spinner";
import useStore from "../store.js";

const placeholder = {
  id: 1,
  placeholder: true,
  metadata: {
    elements: ["a", "b", "c"],
    disabled: [],
    colors: ["red", "green", "blue"],
    color2s: ["red", "green", "blue"],
  },
  _count: { stars: 0 },
  stars: [],
};
const placeHolderPosts = {
  posts: [
    { ...placeholder, key: 1 },
    { ...placeholder, key: 2 },
    { ...placeholder, key: 3 },
    { ...placeholder, key: 4 },
  ],
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
    featured: withDefault(BooleanParam, true),
  });

  // const postId = useStore((state) => state.postId);

  const {
    isLoading,
    error,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["browseData", query],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/query", {
        params: {
          ...query,
          take: 20,
          skip: pageParam,
        },
      });
      let results = result.data;
      results.posts = results.posts.map((r) => {
        r.metadata = JSON.parse(r.metadata);
        return r;
      });
      return results;
    },
    {
      // placeholderData: { pages: [placeHolderPosts] },
      getPreviousPageParam: (firstPage) => firstPage.offset || 0,
      getNextPageParam: (lastPage) => {
        return lastPage?.offset || 0;
      },
    }
  );
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  let dataWithPlaceholder = data ?? { pages: [placeHolderPosts] };
  return (
    <div className="browse-page">
      <div className="browse family">
        {/* <ReactQueryDevtools initialIsOpen /> */}

        {/*<button onClick={(e) => {}}>Open Editor</button>*/}

        {/* <div style={{ float: "right" }}>
          <Home />
        </div> */}
        <span className="filterControls">
          <button
            className={query.featured === true ? "selected" : ""}
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
            Featured
          </button>
          {session && (
            <>
              <button
                className={query.userId === session.userId ? "selected" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setQuery({
                    codeHash: undefined,
                    userId: session.userId,
                    starredBy: undefined,
                    featured: false,
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
                    featured: false,
                    starredBy: session.userId,
                  });
                }}
              >
                {" "}
                Favorited
              </button>
            </>
          )}

          <button
            className={
              !query.starredBy && !query.userId && !query.featured
                ? "selected"
                : ""
            }
            onClick={(e) => {
              e.preventDefault();
              setQuery({
                codeHash: undefined,
                userId: undefined,
                starredBy: undefined,
                featured: false,
              });
            }}
          >
            {" "}
            All
          </button>
        </span>

        <span className="filterControls">
          <Dropdown
            options={options}
            onChange={(e) => {
              if (e.value === "top") {
                setQuery({ order: e.value, days: "365" });
              } else {
                setQuery({ order: e.value, days: undefined });
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
        {isLoading && <Spinner></Spinner>}
        {error && <div>Error: {error}</div>}

        {dataWithPlaceholder?.pages.map((page) => (
          <React.Fragment key={page.nextId}>
            {page.posts.map((d) => {
              return <BrowsePostLink key={d.key ?? d.id} post={d} full />;
            })}
          </React.Fragment>
        ))}
        <div>
          <button
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load Newer"
              : "Nothing more to load"}
          </button>
        </div>
        <div>
          {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
        </div>
      </div>
      <CreateReactAppEntryPoint playMode />
    </div>
  );
}

export default Browse;
