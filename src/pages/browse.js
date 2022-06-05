import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
  useQueryParam,
  useQueryParams,
  StringParam,
  withDefault,
} from "next-query-params";
import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import Home from "../Auth";
import axios from "axios";
import { imageURLBase } from "../ExtraUI";

import ElementButtons from "../ElementButtons";

const options = ["new", "top"];

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
  return (
    <div className="post">
      <a
        className="postThumbnail"
        href={href}
        style={{ fontSize: "1rem" }}
        onClick={handleClick}
      >
        <span className="title">{post.title}</span>

        <img src={`${imageURLBase}${post.id}.png`}></img>
      </a>

      <div className="browse-info">
        <ElementButtons
          elements={metadata.elements}
          disabled={metadata.disabled}
          colors={metadata.colors}
          color2s={metadata.color2s}
          inert={true}
          selectedElement={-1}
        ></ElementButtons>
        <div>
          {"views: " + post.views}
          <br></br>

          {"☆: " + post.stars}
          <br></br>

          <button
            href=""
            onClick={(e) => {
              e.preventDefault();
              setQuery({ codeHash: post.codeHash, userId: undefined });
            }}
          >
            Element Set: {post.codeHash.slice(0, 6)}
          </button>
          <br></br>
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuery({ codeHash: undefined, userId: post.user.id });
            }}
          >
            Author: {post.user.name ?? post.user.id.slice(0, 6)}
          </button>
        </div>
      </div>
    </div>
  );
};

function Browse() {
  const router = useRouter();
  const [order, setOrder] = useQueryParam(
    "order",
    withDefault(StringParam, "new")
  );

  const [query, setQuery] = useQueryParams({
    codeHash: StringParam,
    userId: StringParam,
    order: withDefault(StringParam, "new"),
  });

  //   const { data: session, status } = useSession();

  const [data, setData] = useState([]);
  //   const [timeFrame, setTimeFrame] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/query", { params: query });

      console.log(result);
      setData(result.data);
    };

    fetchData();
  }, [order]);

  console.log(data);
  return (
    <div className="browse family">
      <Home />
      <Dropdown
        options={options}
        onChange={(e) => setOrder(e.value)}
        value={order}
      />
      Browse
      {data.map((d) => {
        return <BrowsePostLink key={d.id} post={d} full />;
      })}
    </div>
  );
}

export default Browse;
