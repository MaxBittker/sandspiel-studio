/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useQuery } from "react-query";
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
const placeHolderPosts = [
  { ...placeholder, id: 1 },
  { ...placeholder, id: 2 },
  { ...placeholder, id: 3 },
  { ...placeholder, id: 4 },
];
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

  const { isLoading, error, data, isFetching } = useQuery(
    ["browseData", query],
    async () => {
      const result = await axios("/api/query", { params: query });
      let results = result.data;
      results = results.map((r) => {
        r.metadata = JSON.parse(r.metadata);
        return r;
      });
      return results;
    },
    { placeholderData: placeHolderPosts }
  );

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
        {data.map((d) => {
          return <BrowsePostLink key={d.id} post={d} full />;
        })}
        {data.length == 0 && <div style={{ width: 750 }}>No posts found</div>}
      </div>

      <CreateReactAppEntryPoint playMode />
    </div>
  );
}

export default Browse;
