/* eslint-disable @next/next/no-img-element */
import React from "react";
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
const placeHolderPosts = {
  posts: [
    { ...placeholder, id: 1 },
    { ...placeholder, id: 2 },
    { ...placeholder, id: 3 },
    { ...placeholder, id: 4 },
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
    featured: BooleanParam,
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

        <Link href={`/`}>Editor</Link>

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
                featured: true,
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
            </>
          )}

          <button
            className={
              query.starredBy !== session?.userId &&
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
              return <BrowsePostLink key={d.id} post={d} full />;
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
        {/* {dataWithPlaceholder?.length == 0 && (
          <div style={{ width: 750 }}>No posts found</div>
        )} */}
      </div>
      <CreateReactAppEntryPoint playMode />
      <style jsx>{`
        .browse-page {
          display: flex;
          height: 100vh;
          width: 100%;
          justify-content: center;
        }
        @media only screen and (max-width: 700px) {
          .browse-page {
            flex-direction: column-reverse;
            height: auto;
          }
        }

        .browse {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin: 10px;
          /* max-width: 90vw; */
          height: 100%;
          overflow: scroll;
        }

        .browse.family {
          margin: 0;
          /* min-width: 765px; */
        }

        @media only screen and (max-width: 500px) {
          .family {
            margin: 0;
          }
        }

        .filterControls {
          display: flex;
          padding: 5px;
        }
      `}</style>
      `
    </div>
  );
}

export default Browse;
