import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import BrowsePostLink from "./browsePostLink.js";

export const Replies = ({ post }) => {
  const {
    isLoading,
    error,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [`repliesData${post.id}`],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/query", {
        params: {
          order: "new",
          take: 10,
          skip: pageParam,
          id: post.id,
          children: true,
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

  return (
    <div className="replies-container">
      {isLoading && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          Loading replies...
        </div>
      )}
      {data?.pages.map((page, i) => (
        <React.Fragment key={`replies${post.id}:page${i}`}>
          {page.posts.map((d) => {
            return (
              <BrowsePostLink
                key={d.key === undefined ? d.id : d.key}
                post={d}
                full
                isReply
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Replies;
