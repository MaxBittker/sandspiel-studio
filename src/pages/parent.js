import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import BrowsePostLink from "./browsePostLink.js";
import { useQueryParams, withDefault, BooleanParam } from "next-query-params";

export const Parent = ({ post }) => {
  const [query, setQuery] = useQueryParams({
    admin: BooleanParam,
  });
  const { isLoading, data } = useQuery(
    [`parentData${post.id}`],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/query", {
        params: {
          id: post.parent.id,
          admin: query.admin || query.admin === undefined ? true : undefined,
        },
      });
      const [parent] = result.data.posts;
      parent.metadata = JSON.parse(parent.metadata);
      return parent;
    }
  );

  return (
    <div className="parent-container">
      {isLoading && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          Loading parent...
        </div>
      )}
      {data && (
        <BrowsePostLink
          key={data.key === undefined ? data.id : data.key}
          post={data}
          full
          isParent
        />
      )}
    </div>
  );
};

export default Parent;
