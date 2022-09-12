/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

// import { ReactQueryDevtools } from "react-query/devtools";
import Dropdown from "react-dropdown";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

import "react-dropdown/style.css";
import {
  useQueryParams,
  StringParam,
  withDefault,
  BooleanParam,
  NumberParam,
} from "next-query-params";
import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import CreateReactAppEntryPoint from "../App";
import BrowsePostLink from "./browsePostLink";
import Spinner from "./spinner";
import useStore from "../store.js";
import Home from "./home.js";
import Profile from "./profile.js";

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
    { ...placeholder, key: "placeholder1" },
    { ...placeholder, key: "placeholder2" },
    { ...placeholder, key: "placeholder3" },
    { ...placeholder, key: "placeholder4" },
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
    //codeHash: StringParam,
    //userId: StringParam,
    //starredBy: StringParam,
    order: withDefault(StringParam, "new"),
    days: StringParam,
    //featured: BooleanParam,
    edit: withDefault(BooleanParam, false),
    id: NumberParam,
    admin: BooleanParam,
  });

  const persistingQuery = {};
  if (query.admin !== undefined) {
    persistingQuery.admin = query.admin ? 1 : 0;
  }

  const home = router.route === "/";
  const featured = home || router.route === "/featured";
  const all = router.route === "/all";
  const playMode = !query.edit;
  const userId = router.query.userid;
  const liked = router.route === "/user/[userid]/likes";

  let singlePost = router.route === "/post/[id]";
  let postId = router.query.id;

  // Backwards compatibility
  if (home && query.id !== undefined) {
    router.push(
      { pathname: `/post/${query.id}`, query: persistingQuery },
      undefined,
      { scroll: false }
    );
  }

  if (singlePost) {
    useStore.setState({ postId });
  }

  const {
    isLoading,
    error,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["browseData", query, router],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/query", {
        params: {
          ...query,
          featured,
          order: home ? "top" : query.order,
          days: home ? "30" : query.days,
          take: home ? 10 : 10,
          skip: pageParam,
          id: singlePost ? postId : undefined,
          userId: !liked ? userId : undefined,
          starredBy: liked ? userId : undefined,
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
  //if (!playMode) return <CreateReactAppEntryPoint />;
  return (
    <div
      className="browse-page"
      style={{
        flexDirection: playMode ? "" : "column-reverse",
      }}
    >
      {
        <div
          className="browse family"
          style={{
            display: playMode ? "" : "none",
          }}
        >
          {/* <ReactQueryDevtools initialIsOpen /> */}

          <span className="nav-bar">
            <div className="nav-bar-group">
              <button
                className={home ? "selected" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    { pathname: "/", query: persistingQuery },
                    undefined,
                    { scroll: false }
                  );
                  /*setQuery({
                  codeHash: undefined,
                  userId: undefined,
                  starredBy: undefined,
                  featured: undefined,
                  id: undefined,
                });*/
                }}
              >
                {" "}
                Home
              </button>
              <button
                className={!home && featured ? "selected" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    {
                      pathname: "/featured",
                      query: persistingQuery,
                    },
                    undefined,
                    { scroll: false }
                  );
                  /*setQuery({
                  codeHash: undefined,
                  userId: undefined,
                  starredBy: undefined,
                  featured: true,
                  id: undefined,
                });*/
                }}
              >
                {" "}
                Featured
              </button>

              <button
                className={all ? "selected" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    { pathname: "/all", query: persistingQuery },
                    undefined,
                    { scroll: false }
                  );
                  /*setQuery({
                  codeHash: undefined,
                  userId: undefined,
                  starredBy: undefined,
                  featured: false,
                  id: undefined,
                });*/
                }}
              >
                {" "}
                All
              </button>
            </div>
            <div className="nav-bar-group">
              {session ? (
                <button
                  className={
                    !liked && userId === session.userId ? "selected" : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      {
                        pathname: `/user/${session.userId}`,
                        query: persistingQuery,
                      },
                      undefined,
                      { scroll: false }
                    );
                    /*setQuery({
                      codeHash: undefined,
                      userId: session.userId,
                      starredBy: undefined,
                      featured: false,
                      id: undefined,
                    });*/
                  }}
                >
                  {" "}
                  My Profile
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </span>

          {!singlePost && !home && (
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
          )}
          {isLoading && <Spinner></Spinner>}
          {error && <div>Error: {error}</div>}

          {home && <Home />}
          {userId && <Profile />}
          {dataWithPlaceholder?.pages.map((page, i) => (
            <React.Fragment key={`page${i}`}>
              {page.posts.map((d) => {
                return (
                  <BrowsePostLink
                    key={d.key === undefined ? d.id : d.key}
                    post={d}
                    full
                  />
                );
              })}
            </React.Fragment>
          ))}
          {!singlePost && (
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
          )}
          {/*<div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>*/}
        </div>
      }
      <CreateReactAppEntryPoint />
    </div>
  );
}

export default Browse;
