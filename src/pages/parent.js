import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import BrowsePostLink from "./browsePostLink.js";

export const Parent = ({ post }) => {
  const { isLoading, data } = useQuery(
    [`parentData${post.id}`],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/query", {
        params: {
          id: post.parent.id,
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
        <div style={{ textAlign: "center" }}>Loading parent...</div>
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
